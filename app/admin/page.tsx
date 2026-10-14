import Link from "next/link";
import { Activity, ArrowUpRight, BadgeCheck, Bot, CircleDashed, CreditCard, Gauge, LifeBuoy, LockKeyhole, Search, ShieldCheck, Users, WalletCards, Workflow } from "lucide-react";
import { PortalShell } from "../components/PortalShell";

export const metadata = { title: "Platform Admin | Aptinusa", description: "Aptinusa platform operations control-panel preview.", robots: { index: false, follow: false } };

const controls = [
  { icon: Users, title: "Tenants & workspaces", text: "Organization directory, ownership, lifecycle, quotas, and workspace suspension workflow.", tag: "CORE CONTROL", href: "/admin/" },
  { icon: CreditCard, title: "Plans & entitlements", text: "Plan catalog, module access, usage limits, grace periods, and billing event validation.", tag: "BILLING", href: "/admin/" },
  { icon: Bot, title: "AI & modules", text: "Provider readiness, model policy, scoped tools, token budgets, and module entitlement.", tag: "AI OPERATIONS", href: "/agents/" },
  { icon: Gauge, title: "Usage & limits", text: "API requests, messages, AI consumption, automation jobs, and rate-limit controls.", tag: "OBSERVABILITY", href: "/status/" },
  { icon: BadgeCheck, title: "Audit & compliance", text: "Sensitive access, administrative changes, export events, approvals, and investigations.", tag: "SECURITY", href: "/api/" },
  { icon: LifeBuoy, title: "Support operations", text: "Customer incidents, integration readiness, escalation, and service communications.", tag: "SUPPORT", href: "/status/" },
];

export default function Admin() {
  return <PortalShell active="/admin/" area="admin">
    <div className="td-page-head"><div><span className="td-eyebrow">PLATFORM CONTROL PLANE / OPERATIONS</span><h1>Aptinusa Control Center</h1><p>Operate the platform with clear tenant boundaries, verified data, and auditable changes.</p></div><span className="td-admin-chip"><LockKeyhole size={15}/> INTERNAL PREVIEW</span></div>
    <div className="td-preview-alert td-alert-admin"><ShieldCheck size={19}/><div><b>Read-only admin preview</b><p>This screen is not connected to production tenant records or billing. Administrative actions require authenticated roles, persistent audit logs, and end-to-end security tests.</p></div><span>NO LIVE DATA</span></div>
    <div className="td-stat-grid">
      <article className="td-stat-card"><div className="td-stat-icon green"><Users size={19}/></div><span>Registered tenants</span><strong>—</strong><small><CircleDashed size={12}/> Waiting for tenant service</small></article>
      <article className="td-stat-card"><div className="td-stat-icon blue"><CreditCard size={19}/></div><span>Active subscriptions</span><strong>—</strong><small><CircleDashed size={12}/> Billing not connected</small></article>
      <article className="td-stat-card"><div className="td-stat-icon violet"><WalletCards size={19}/></div><span>Recurring revenue</span><strong>—</strong><small><CircleDashed size={12}/> No financial data displayed</small></article>
      <article className="td-stat-card"><div className="td-stat-icon amber"><Activity size={19}/></div><span>Platform status</span><strong>Preview</strong><small><CircleDashed size={12}/> Monitoring not live</small></article>
    </div>
    <div className="td-section-head"><div><h2>Platform operations</h2><p>Control areas planned for authenticated platform operators.</p></div><span className="td-muted-label">6 CONTROL AREAS</span></div>
    <div className="td-module-grid td-admin-module-grid">{controls.map(({icon:Icon,title,text,tag,href})=><Link href={href} className="td-module-card" key={title}><div className="td-module-top"><span className="td-module-icon"><Icon size={20}/></span><span className="td-module-tag">{tag}</span></div><h3>{title}</h3><p>{text}</p><span className="td-module-link">Open control area <ArrowUpRight size={15}/></span></a>)}</div>
    <div className="td-bottom-grid"><section className="td-panel"><div className="td-panel-head"><div><h2>Release readiness</h2><p>Production gates that still need verification</p></div><Workflow size={20}/></div><div className="td-readiness-list"><div><span>Database least-privilege runtime</span><b className="td-pill td-pill-amber">Verify</b></div><div><span>Authentication & role enforcement</span><b className="td-pill td-pill-amber">Verify</b></div><div><span>Audit persistence & alerting</span><b className="td-pill">Pending</b></div><div><span>Official channel end-to-end tests</span><b className="td-pill">Pending</b></div></div></section><section className="td-panel"><div className="td-panel-head"><div><h2>Security posture</h2><p>Required operating principles</p></div><ShieldCheck size={20}/></div><div className="td-security-line"><LockKeyhole size={17}/><span><b>Tenant isolation</b><small>Every read and write must be scoped to an authorized tenant.</small></span></div><div className="td-security-line"><BadgeCheck size={17}/><span><b>Least privilege</b><small>Elevated database roles are not for application runtime.</small></span></div><div className="td-security-line"><Search size={17}/><span><b>Auditable actions</b><small>Privileged changes need actor, scope, reason, and outcome.</small></span></div></section></div>
  </PortalShell>;
}
