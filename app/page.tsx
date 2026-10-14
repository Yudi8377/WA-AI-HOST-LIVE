"use client";

import Link from "next/link";
import { ArrowRight, Bot, Boxes, BrainCircuit, CheckCircle2, ChevronRight, CircleDot, LockKeyhole, MessageSquareText, Network, ShieldCheck, Workflow } from "lucide-react";

const capabilities = [
  { icon: MessageSquareText, title: "Conversations that stay connected", text: "Bring customer context and assisted replies into a workspace your team can understand." },
  { icon: Workflow, title: "Workflows with guardrails", text: "Automate repetitive steps with scoped actions, approvals, retries, and clear ownership." },
  { icon: BrainCircuit, title: "Specialized AI agents", text: "Coordinate focused agents for support, knowledge, operations, and analysis under shared policies." },
];

function OrbitIllustration() {
  return <div className="wonder-orbit-stage" aria-label="Illustration of business systems connected to the Aptinusa AI core" role="img">
    <div className="wonder-halo wonder-halo-a" /><div className="wonder-halo wonder-halo-b" />
    <div className="wonder-core"><Bot size={43}/><strong>APTINUSA</strong><small>AI COORDINATION CORE</small></div>
    <div className="wonder-float wonder-float-a"><MessageSquareText/><span>Customer care</span></div>
    <div className="wonder-float wonder-float-b"><Boxes/><span>Commerce</span></div>
    <div className="wonder-float wonder-float-c"><Workflow/><span>Automation</span></div>
    <div className="wonder-float wonder-float-d"><Network/><span>AI agents</span></div>
    <span className="wonder-spark wonder-spark-a"/><span className="wonder-spark wonder-spark-b"/><span className="wonder-spark wonder-spark-c"/>
  </div>;
}

export default function Website() {
  return <main className="wonder-site" id="top">
    <nav className="wonder-nav">
      <Link href="/" className="wonder-brand"><span className="wonder-brand-mark"><Bot size={23}/></span><span><b>APTINUSA</b><small>ADAPTIVE INTELLIGENCE</small></span></Link>
      <div className="wonder-nav-links"><a href="#platform">Platform</a><a href="#how-it-works">How it works</a><Link href="/api/">Developers</Link><Link href="/status/">Status</Link><Link className="wonder-nav-cta" href="/dashboard/">Open workspace <ArrowRight size={15}/></Link></div>
    </nav>
    <header className="wonder-hero">
      <div className="wonder-hero-inner">
        <div className="wonder-hero-copy">
          <span className="wonder-eyebrow"><CircleDot size={12}/> ADAPTIVE INTELLIGENCE. CONNECTED BUSINESS.</span>
          <h1>Your business,<br/><em>working as one.</em></h1>
          <p>Connect customer conversations, business workflows, and coordinated AI assistance in one workspace—designed to grow from a small team to an enterprise.</p>
          <div className="wonder-actions"><Link className="wonder-btn wonder-btn-light" href="/dashboard/">Explore the workspace <ArrowRight size={16}/></Link><a className="wonder-btn wonder-btn-outline" href="#platform">Discover the platform</a></div>
          <div className="wonder-proof"><span><ShieldCheck size={15}/> Tenant-aware by design</span><span><LockKeyhole size={15}/> Permission-first</span></div>
        </div>
        <OrbitIllustration/>
      </div>
      <div className="wonder-wave" aria-hidden="true"/>
    </header>
    <section className="wonder-intro" id="platform">
      <div><span className="wonder-section-tag">ONE WORKSPACE · MODULAR CAPABILITIES</span><h2>Start with one challenge.<br/><em>Expand on your terms.</em></h2></div>
      <p>Aptinusa brings the tools together without hiding the controls. Enable each channel or module only when its official access, authorization, and readiness checks are complete.</p>
    </section>
    <section className="wonder-feature-list">
      {capabilities.map((item, index) => { const Icon = item.icon; return <article className={index % 2 ? "wonder-feature wonder-feature-reverse" : "wonder-feature"} key={item.title}>
        <div className="wonder-feature-art"><div className="wonder-feature-ring"/><div className="wonder-feature-symbol"><Icon size={54}/></div><span className="wonder-art-label">{["LISTEN","COORDINATE","IMPROVE"][index]}</span><span className="wonder-art-dot dot-one"/><span className="wonder-art-dot dot-two"/></div>
        <div className="wonder-feature-copy"><span className="wonder-section-tag">APTINUSA PLATFORM</span><h3>{item.title}</h3><p>{item.text}</p><ul><li><CheckCircle2 size={16}/> Clear permissions and ownership</li><li><CheckCircle2 size={16}/> Human review where it matters</li><li><CheckCircle2 size={16}/> Transparent readiness status</li></ul><Link href={index === 0 ? "/workspace/" : index === 1 ? "/connectors/" : "/agents/"} className="wonder-text-link">Explore capability <ChevronRight size={16}/></Link></div>
      </article>; })}
    </section>
    <section className="wonder-steps" id="how-it-works"><span className="wonder-section-tag">A CONTROLLED PATH TO LAUNCH</span><h2>Connect with confidence.</h2><div className="wonder-step-grid"><article><span>01</span><h3>Set up your workspace</h3><p>Define your organization, team access, and operating boundaries.</p></article><article><span>02</span><h3>Connect official channels</h3><p>Authorize supported integrations and review exactly what each one can access.</p></article><article><span>03</span><h3>Test before activation</h3><p>Validate workflows, approvals, usage limits, and handoff to a human.</p></article></div><Link className="wonder-btn wonder-btn-green" href="/connectors/">Review integrations <ArrowRight size={16}/></Link></section>
    <section className="wonder-bottom-cta"><div><span className="wonder-section-tag">BUILT FOR SMALL TEAMS TO ENTERPRISE</span><h2>Keep the intelligence.<br/>Keep control of your business.</h2><p>Explore the product previews while production connections are being verified.</p></div><Link className="wonder-btn wonder-btn-light" href="/dashboard/">Open customer preview <ArrowRight size={16}/></Link></section>
    <footer className="wonder-footer"><Link href="/" className="wonder-brand"><span className="wonder-brand-mark"><Bot size={20}/></span><b>APTINUSA</b></Link><span>Adaptive Intelligence. Connected Business.</span><div><Link href="/api/">API docs</Link><Link href="/connectors/">Integrations</Link><Link href="/status/">Service status</Link></div><small>Product preview. No external messaging, billing, or connector is represented as live until end-to-end verified.</small></footer>
  </main>;
}
