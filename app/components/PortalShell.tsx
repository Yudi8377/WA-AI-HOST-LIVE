"use client";

import Link from "next/link";
import { useState } from "react";
import { Activity, BookOpen, Bot, BrainCircuit, Code2, Globe2, LayoutDashboard, ShieldCheck, Workflow, Menu, X } from "lucide-react";

const links=[{href:"/",label:"Website resmi",icon:Globe2,group:"PLATFORM"},{href:"/dashboard/",label:"Dashboard pelanggan",icon:LayoutDashboard,group:"WORKSPACE"},{href:"/admin/",label:"Admin control panel",icon:ShieldCheck,group:"WORKSPACE"},{href:"/workspace/",label:"Inbox simulator",icon:Workflow,group:"WORKSPACE"},{href:"/api/",label:"API integrasi",icon:Code2,group:"DEVELOPERS"},{href:"/connectors/",label:"Dokumentasi konektor",icon:BookOpen,group:"DEVELOPERS"},{href:"/agents/",label:"Jaringan multi-agent",icon:BrainCircuit,group:"DEVELOPERS"},{href:"/status/",label:"Status layanan",icon:Activity,group:"DEVELOPERS"}];

export function PortalShell({children,active,area="customer"}:{children:React.ReactNode;active:string;area?:"customer"|"admin"}) {
  const [mobileOpen,setMobileOpen]=useState(false);
  const current=links.find(x=>x.href===active)?.label??"Platform";
  return <div className={`apt-shell td-shell ${mobileOpen?"td-mobile-open":""}`}>
    {mobileOpen&&<button className="td-mobile-scrim" aria-label="Close navigation" onClick={()=>setMobileOpen(false)}/>}
    <aside className="apt-sidebar td-sidebar">
      <Link href="/" className="apt-brand td-brand" onClick={()=>setMobileOpen(false)}><span className="apt-mark"><Bot size={21}/></span><span><b>APTINUSA</b><small>ADAPTIVE BUSINESS INTELLIGENCE</small></span></Link>
      {["PLATFORM","WORKSPACE","DEVELOPERS"].map(group=><div className="td-nav-group" key={group}><div className="apt-side-label">{group}</div><nav>{links.filter(item=>item.group===group).map(item=>{const Icon=item.icon;return <Link key={item.href} href={item.href} onClick={()=>setMobileOpen(false)} className={active===item.href?"apt-nav td-nav active":"apt-nav td-nav"}><Icon size={17}/><span>{item.label}</span></Link>})}</nav></div>)}
      <div className="apt-side-bottom td-sidebar-bottom"><div className="apt-secure"><ShieldCheck size={17}/><div><b>Security-first</b><p>Tenant isolation, audit, and permission-aware workflows.</p></div></div><small>EARLY ACCESS · NOT ALL MODULES LIVE</small></div>
    </aside>
    <main className="apt-main td-main">
      <header className="apt-topbar td-topbar"><div className="td-topbar-left"><button className="td-menu-button" onClick={()=>setMobileOpen(!mobileOpen)} aria-label={mobileOpen?"Close menu":"Open menu"} aria-expanded={mobileOpen}>{mobileOpen?<X size={19}/>:<Menu size={19}/>}</button><span className="td-breadcrumb">APTINUSA <i>/</i> {current}</span></div><div className="td-topbar-right"><span className="td-area-label">{area==="admin"?"PLATFORM ADMIN":"CUSTOMER WORKSPACE"}</span><span className="apt-preview"><i/> PREVIEW / DEVELOPMENT</span><span className="td-avatar" aria-label="Preview profile"><Bot size={17}/></span></div></header>
      <div className="apt-content td-content">{children}<footer className="apt-footer td-footer"><span>© Aptinusa · Adaptive Intelligence. Connected Business.</span><span>Build transparently. Connect officially. Protect customer data.</span></footer></div>
    </main>
  </div>;
}
export function SectionHeading({eyebrow,title,description}:{eyebrow:string;title:string;description:string}){return <div className="apt-heading"><span>{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>}
export function FeatureCard({icon,title,children}:{icon:React.ReactNode;title:string;children:React.ReactNode}){return <article className="apt-card"><div className="apt-card-icon">{icon}</div><h3>{title}</h3><div className="apt-card-copy">{children}</div></article>}
