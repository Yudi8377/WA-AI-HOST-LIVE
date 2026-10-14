/**
 * Aptinusa agent-network kernel.
 * Provider-neutral orchestration/security layer; not an LLM provider or deployed worker.
 * Authorization, approval verification, audit persistence and idempotency storage are server adapters.
 */
/** @typedef {"read"|"write"|"external"|"infrastructure"} RiskTier */
/** @typedef {{taskId:string,traceId:string,tenantId:string,actorId:string,agentId:string,taskType:string,payload:unknown,policyVersion:string,allowedTools:string[],riskTier:RiskTier,approvalRef?:string,idempotencyKey?:string,deadlineAt:string,budgetUsd:number}} TaskEnvelope */
const RISK = Object.freeze({read:0,write:1,external:2,infrastructure:3});
const MAX_TASK_ID_LENGTH = 160;
/**
 * @param {{
 * authorizeMembership:(input:{actorId:string,tenantId:string})=>Promise<boolean>,
 * verifyApproval:(input:{approvalRef:string,actorId:string,tenantId:string,taskId:string,riskTier:RiskTier})=>Promise<boolean>,
 * auditSink:(record:Record<string,unknown>)=>Promise<void>,
 * idempotencyStore:{get:(tenantId:string,key:string)=>Promise<any>,put:(tenantId:string,key:string,outcome:any)=>Promise<void>},
 * maxBudgetUsd?:number,now?:()=>number
 * }} dependencies
 */
export function createAgentNetwork(dependencies) {
 if(!dependencies||typeof dependencies.authorizeMembership!=="function"||typeof dependencies.verifyApproval!=="function"||typeof dependencies.auditSink!=="function"||typeof dependencies.idempotencyStore?.get!=="function"||typeof dependencies.idempotencyStore?.put!=="function") throw new TypeError("Agent network requires authorization, approval, audit and idempotency adapters.");
 const agents=new Map(), now=dependencies.now??(()=>Date.now()), maxBudgetUsd=dependencies.maxBudgetUsd??1;
 function register(agent){
  if(!agent||!/^[a-z][a-z0-9-]{1,63}$/.test(agent.id)||typeof agent.execute!=="function"||!Array.isArray(agent.taskTypes)||!Array.isArray(agent.requiredTools)||!Object.hasOwn(RISK,agent.minimumRiskTier)) throw new TypeError("Invalid agent definition.");
  if(agents.has(agent.id)) throw new Error("Agent ID already registered.");
  agents.set(agent.id,Object.freeze({...agent,taskTypes:Object.freeze([...agent.taskTypes]),requiredTools:Object.freeze([...agent.requiredTools])}));
 }
 async function audit(record){
  try{await dependencies.auditSink(record);}catch{throw new Error("AUDIT_SINK_UNAVAILABLE");}
 }
 async function run(task){
  const started=now();
  const safeBase={taskId:typeof task?.taskId==="string"?task.taskId.slice(0,MAX_TASK_ID_LENGTH):"invalid-task",traceId:typeof task?.traceId==="string"?task.traceId.slice(0,MAX_TASK_ID_LENGTH):"untraced",agentId:typeof task?.agentId==="string"?task.agentId:"unknown"};
  const finish=async(status,extra={})=>{
   const outcome={status,...safeBase,elapsedMs:Math.max(0,now()-started),...extra};
   await audit({event:"agent_task_finished",tenantId:typeof task?.tenantId==="string"?task.tenantId:"unknown",actorId:typeof task?.actorId==="string"?task.actorId:"unknown",...outcome,policyVersion:task?.policyVersion??"unknown"});
   return outcome;
  };
  if(!task||!["taskId","traceId","tenantId","actorId","agentId","taskType","policyVersion","deadlineAt"].every(k=>typeof task[k]==="string"&&task[k].length>0)||!Array.isArray(task.allowedTools)||!["read","write","external","infrastructure"].includes(task.riskTier)||!Number.isFinite(task.budgetUsd)||task.budgetUsd<=0||task.budgetUsd>maxBudgetUsd||!Number.isFinite(Date.parse(task.deadlineAt))||Date.parse(task.deadlineAt)<=now()) return finish("blocked",{reason:"INVALID_TASK_OR_BUDGET"});
  let authorized=false;
  try{authorized=await dependencies.authorizeMembership({actorId:task.actorId,tenantId:task.tenantId});}catch{return finish("error",{reason:"AUTHORIZATION_CHECK_FAILED"});}
  if(!authorized)return finish("blocked",{reason:"TENANT_MEMBERSHIP_DENIED"});
  const agent=agents.get(task.agentId);
  if(!agent)return finish("blocked",{reason:"AGENT_NOT_REGISTERED"});
  if(!agent.taskTypes.includes(task.taskType))return finish("blocked",{reason:"TASK_TYPE_NOT_ALLOWED"});
  if(RISK[task.riskTier]<RISK[agent.minimumRiskTier])return finish("blocked",{reason:"RISK_TIER_TOO_LOW"});
  if(!agent.requiredTools.every(tool=>task.allowedTools.includes(tool)))return finish("blocked",{reason:"TOOL_SCOPE_DENIED"});
  if(task.riskTier==="write"&&(!task.idempotencyKey||task.idempotencyKey.length>200))return finish("blocked",{reason:"IDEMPOTENCY_KEY_REQUIRED"});
  if(task.riskTier==="external"||task.riskTier==="infrastructure"){
   if(!task.approvalRef)return finish("blocked",{reason:"HUMAN_APPROVAL_REQUIRED"});
   let approved=false;
   try{approved=await dependencies.verifyApproval({approvalRef:task.approvalRef,actorId:task.actorId,tenantId:task.tenantId,taskId:task.taskId,riskTier:task.riskTier});}catch{return finish("error",{reason:"APPROVAL_CHECK_FAILED"});}
   if(!approved)return finish("blocked",{reason:"APPROVAL_INVALID"});
  }
  if(task.idempotencyKey){
   let prior;
   try{prior=await dependencies.idempotencyStore.get(task.tenantId,task.idempotencyKey);}catch{return finish("error",{reason:"IDEMPOTENCY_STORE_UNAVAILABLE"});}
   if(prior)return finish("deduplicated",{reason:"IDEMPOTENCY_REPLAY",output:prior.output});
  }
  const remainingMs=Date.parse(task.deadlineAt)-now(), controller=new AbortController();
  let timeout;
  try{
   const execution=Promise.resolve().then(()=>agent.execute({task,allowedTools:new Set(task.allowedTools),signal:controller.signal}));
   const deadline=new Promise((_,reject)=>{timeout=setTimeout(()=>{controller.abort();reject(new Error("TASK_DEADLINE_EXCEEDED"));},remainingMs);});
   const output=await Promise.race([execution,deadline]);
   const outcome=await finish("ok",{output});
   if(task.idempotencyKey){try{await dependencies.idempotencyStore.put(task.tenantId,task.idempotencyKey,outcome);}catch{return finish("error",{reason:"IDEMPOTENCY_PERSIST_FAILED"});}}
   return outcome;
  }catch(error){const reason=error instanceof Error&&error.message==="TASK_DEADLINE_EXCEEDED"?"TASK_DEADLINE_EXCEEDED":"AGENT_EXECUTION_FAILED";return finish("error",{reason});}
  finally{if(timeout)clearTimeout(timeout);}
 }
 return Object.freeze({register,run,list:()=>[...agents.values()].map(({id,description,taskTypes,minimumRiskTier,requiredTools})=>({id,description,taskTypes:[...taskTypes],minimumRiskTier,requiredTools:[...requiredTools]}))});
}
