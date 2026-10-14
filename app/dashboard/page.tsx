import Link from "next/link";
import { Activity, Bot, Boxes, CheckCircle2, CircleDashed, CreditCard, Link2, MessageSquareText, ShieldCheck, Users, Workflow, ArrowUpRight, Settings2 } from "lucide-react";
import { PortalShell } from "../components/PortalShell";

export const metadata = { title: "Customer Workspace | Aptinusa", description: "Aptinusa customer workspace preview.", robots: { index: false, follow: false } };

const modules = [
  { icon: MessageSquareText, title: "Inbox & customer care", text: "Review conversations, AI drafts, handoff, and customer context.", href: "/workspace/", status: "Preview" },
  { icon: Link2, title: "Channel connections", text: "Manage authorized accounts, permissions, connection health, and revocation.", href: "/connectors/", status: "Setup needed" },
  { icon: Bot, title: "AI assistants", text: "Configure tone, knowledge sources, boundaries, and human handoff rules.", href: "/agents/", status: "Preview" },
  { icon: Workflow, title: "Workflow automation", text: "Design triggers, conditions, approved actions, retries, and audit steps.", href: "/agents/", status: "Planned" },
  { icon: Boxes, title: "Business data", text: "Organize leads, customer records, catalog context, and approved syncs.", href: "/api/", status: "Not connected" },
  { icon: Users, title: "Team & access", text: "Prepare workspace roles, team invitations, and permission reviews.", href: "/dashboard/", status: "Preview" },
];

export default function Dashboard() {
  return <PortalShell active="/dashboard/" area="customer">
    <div className="td-page-head"><div><span className="td-eyebrow">CUSTOMER WORKSPACE / OVERVIEW</span><h1>Good to have you here.</h1><p>Your business tools, channels, and AI assistance—organized in one place.</p></div><Link className="td-outline-button" href="/connectors/"><Settings2 size={16}/> Workspace setup</Link></div>
    <div className="td-preview-alert"><CircleDashed size={19}/><div><b>Preview workspace</b><p>This is a UI preview, not an authenticated customer account. Do not enter personal data, access tokens, or production credentials here.</p></div><span>DEVELOPMENT</span></div>
    <div className="td-stat-grid">
      <article className="td-stat-card"><div className="td-stat-icon green"><MessageSquareText size={19}/></div><span>Conversations</span><strong>—</strong><small><CircleDashed size={12}/> Waiting for inbox service</small></article>
      <article className="td-stat-card"><div className="td-stat-icon blue"><Link2 size={19}/></div><span>Connected channels</span><strong>0</strong><small><CircleDashed size={12}/> No live connector configured</small></article>
      <article className="td-stat-card"><div className="td-stat-icon violet"><Bot size={19}/></div><span>AI assistants</span><strong>Preview</strong><small><CircleDashed size={12}/> Model provider not connected</small></article>
      <article className="td-stat-card"><div className="td-stat-icon amber"><CreditCard size={19}/></div><span>Plan & usage</span><strong>—</strong><small><CircleDashed size={12}/> Billing is not connected</small></article>
    </div>
    <div className="td-section-head"><div><h2>Your workspace</h2><p>Choose a capability to explore its setup and readiness requirements.</p></div><span className="td-muted-label">6 MODULES</span></div>
    <div className="td-module-grid">{modules.map(({icon:Icon,title,text,href,status})=><Link href={href} className="td-module-card" key={title}><div className="td-module-top"><span className="td-module-icon"><Icon size={20}/></span><span className={status==="Preview"?"td-pill td-pill-green":status==="Setup needed"?"td-pill td-pill-amber":"td-pill"}>{status}</span></div><h3>{title}</h3><p>{text}</p><span className="td-module-link">Open module <ArrowUpRight size={15}/></span></a>)}</div>
    <div className="td-bottom-grid"><section className="td-panel"><div className="td-panel-head"><div><h2>Getting started</h2><p>Suggested setup sequence</p></div><ShieldCheck size={20}/></div><div className="td-checklist"><div><CheckCircle2 size={17}/><span><b>Review workspace boundaries</b><small>Choose owners and access roles before inviting a team.</small></span><em>STEP 1</em></div><div><CircleDashed size={17}/><span><b>Connect an official channel</b><small>Authorize the business account and review requested scopes.</small></span><em>STEP 2</em></div><div><CircleDashed size={17}/><span><b>Test AI and human handoff</b><small>Run controlled tests before enabling real customer messages.</small></span><em>STEP 3</em></div></div></section><section className="td-panel"><div className="td-panel-head"><div><h2>Workspace health</h2><p>Current integration readiness</p></div><Activity size={20}/></div><div className="td-health-row"><span><i className="td-health-dot amber-dot"/> Authentication</span><b>Not connected</b></div><div className="td-health-row"><span><i className="td-health-dot gray-dot"/> Messaging API</span><b>Not verified</b></div><div className="td-health-row"><span><i className="td-health-dot gray-dot"/> Subscription billing</span><b>Not connected</b></div><div className="td-health-note">Live status will appear here after service monitoring is connected.</div></section></div>
  </PortalShell>;
}
