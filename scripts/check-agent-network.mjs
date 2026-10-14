import assert from "node:assert/strict";
import { createAgentNetwork } from "../src/lib/agents/network.mjs";
const audits=[], idempotency=new Map();
const network=createAgentNetwork({
 authorizeMembership:async ({actorId,tenantId})=>actorId==="owner-1"&&tenantId==="tenant-1",
 verifyApproval:async ({approvalRef})=>approvalRef==="approval-verified",
 auditSink:async record=>{audits.push(record);},
 idempotencyStore:{get:async(tenant,key)=>idempotency.get(tenant+":"+key),put:async(tenant,key,value)=>{idempotency.set(tenant+":"+key,value);}},
 maxBudgetUsd:0.25
});
let executions=0;
network.register({id:"knowledge-agent",description:"Read-only test agent",taskTypes:["knowledge.lookup"],minimumRiskTier:"read",requiredTools:["knowledge.read"],execute:async({task,allowedTools})=>{executions++;assert.equal(allowedTools.has("knowledge.read"),true);return {answer:"synthetic",tenant:task.tenantId};}});
network.register({id:"send-agent",description:"Outbound action test agent",taskTypes:["message.send"],minimumRiskTier:"external",requiredTools:["channel.send"],execute:async()=>{executions++;return {sent:true};}});
const base={taskId:"task-1",traceId:"trace-1",tenantId:"tenant-1",actorId:"owner-1",agentId:"knowledge-agent",taskType:"knowledge.lookup",payload:{query:"test"},policyVersion:"test-v1",allowedTools:["knowledge.read"],riskTier:"read",deadlineAt:new Date(Date.now()+3000).toISOString(),budgetUsd:0.1};
const success=await network.run(base);
assert.equal(success.status,"ok");assert.equal(success.output.tenant,"tenant-1");assert.equal(executions,1);
assert.equal((await network.run({...base,taskId:"task-2",tenantId:"tenant-2"})).reason,"TENANT_MEMBERSHIP_DENIED");
assert.equal((await network.run({...base,taskId:"task-3",allowedTools:[]})).reason,"TOOL_SCOPE_DENIED");
assert.equal((await network.run({...base,taskId:"task-4",budgetUsd:9})).reason,"INVALID_TASK_OR_BUDGET");
assert.equal((await network.run({...base,taskId:"task-5",agentId:"send-agent",taskType:"message.send",riskTier:"external",allowedTools:["channel.send"]})).reason,"HUMAN_APPROVAL_REQUIRED");
const approvedTask={...base,taskId:"task-6",agentId:"send-agent",taskType:"message.send",riskTier:"external",allowedTools:["channel.send"],approvalRef:"approval-verified",idempotencyKey:"send-once"};
assert.equal((await network.run(approvedTask)).status,"ok");
assert.equal((await network.run({...approvedTask,taskId:"task-7"})).status,"deduplicated");
assert.ok(audits.length>=7);assert.ok(audits.every(item=>item.event==="agent_task_finished"));
console.log("Aptinusa agent network tests passed: tenant gate, tool scope, budget, approval, idempotency and audit.");
