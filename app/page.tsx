"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Bot, Boxes, BrainCircuit, CheckCircle2, LockKeyhole, Menu, MessageSquareText, ShieldCheck, Workflow, X } from "lucide-react";

/* Adapted from Start Bootstrap One Page Wonder (MIT), retaining its original page structure. */
const sections = [
  {
    id: "customer-intelligence",
    kicker: "CUSTOMER INTELLIGENCE",
    title: "Every conversation becomes business context.",
    text: "Bring customer conversations, handoffs, and team knowledge into one workspace. Help your team respond consistently without losing the context behind each customer relationship.",
    bullets: ["Customer conversations and shared context", "Human handoff and permission-aware workflows", "A clear path from inquiry to follow-up"],
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1000&q=85",
    alt: "Team collaborating around a digital workspace",
    href: "/workspace/",
    link: "Explore the conversation workspace",
    reverse: true
  },
  {
    id: "connected-workflows",
    kicker: "CONNECTED WORKFLOWS",
    title: "Make repetitive work flow—with controls.",
    text: "Coordinate CRM, sales follow-up, knowledge, and automations in a modular operating layer. Each connection should expose its permissions, readiness, and ownership before it is activated.",
    bullets: ["Modular workflows for different business needs", "Scoped actions, approval gates, and audit intent", "Official channel readiness shown transparently"],
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=85",
    alt: "Business team planning a coordinated workflow",
    href: "/connectors/",
    link: "Review integrations",
    reverse: false
  },
  {
    id: "coordinated-ai",
    kicker: "COORDINATED AI",
    title: "Specialized agents. One governed workspace.",
    text: "Use focused AI roles for support, knowledge, operations, and analysis. Coordination follows shared policy, budget limits, tenant boundaries, and human review—not uncontrolled agent access.",
    bullets: ["Purpose-specific agent responsibilities", "Tenant-aware access and tool permissions", "Human review for sensitive or external actions"],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1000&q=85",
    alt: "Colleagues working together on strategy",
    href: "/agents/",
    link: "Explore the AI architecture",
    reverse: true
  }
];

export default function Website() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  return (
    <main className="opw-site" id="page-top">
      <nav className="navbar navbar-expand-lg navbar-dark navbar-custom fixed-top" aria-label="Main navigation">
        <div className="container px-5">
          <Link className="navbar-brand d-flex align-items-center gap-2" href="/" onClick={closeMenu}>
            <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white text-success" style={{width: 38, height: 38}}><Bot size={22}/></span>
            <span>APTINUSA</span>
          </Link>
          <button className="navbar-toggler" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-controls="navbarResponsive" aria-expanded={menuOpen} aria-label={menuOpen ? "Close navigation" : "Open navigation"}>
            {menuOpen ? <X size={22}/> : <Menu size={22}/>}
          </button>
          <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`} id="navbarResponsive">
            <ul className="navbar-nav ms-auto align-items-lg-center">
              <li className="nav-item"><Link className="nav-link" href="#platform" onClick={closeMenu}>Platform</Link></li>
              <li className="nav-item"><Link className="nav-link" href="#how-it-works" onClick={closeMenu}>How it works</Link></li>
              <li className="nav-item"><Link className="nav-link" href="/api/" onClick={closeMenu}>Developers</Link></li>
              <li className="nav-item"><Link className="nav-link" href="/status/" onClick={closeMenu}>Status</Link></li>
              <li className="nav-item ms-lg-2"><Link className="nav-link fw-bold" href="/dashboard/" onClick={closeMenu}>Open workspace <ArrowRight size={15} className="ms-1"/></Link></li>
            </ul>
          </div>
        </div>
      </nav>

      <header className="masthead text-center text-white">
        <div className="masthead-content">
          <div className="container px-5">
            <span className="aptinusa-eyebrow"><Bot size={14} className="me-2"/> ADAPTIVE INTELLIGENCE · CONNECTED BUSINESS</span>
            <h1 className="masthead-heading mb-0">Your business,<br/>working as one.</h1>
            <h2 className="masthead-subheading mb-0">Customer context. Connected workflows. Coordinated AI.</h2>
            <p className="lead mx-auto mt-4 mb-0" style={{maxWidth: 760}}>A modular AI business workspace designed to connect customer engagement, operations, and intelligent assistance—from growing teams to enterprise environments.</p>
            <div className="d-flex flex-wrap justify-content-center gap-3 mt-5">
              <Link className="btn btn-primary btn-xl rounded-pill" href="/dashboard/">Explore the workspace <ArrowRight size={17} className="ms-2"/></Link>
              <Link className="btn btn-outline-light btn-xl rounded-pill" href="#platform">Discover the platform</Link>
            </div>
            <div className="d-flex justify-content-center flex-wrap gap-4 mt-4 small">
              <span><ShieldCheck size={15} className="me-2"/>Tenant-aware by design</span>
              <span><LockKeyhole size={15} className="me-2"/>Permission-first workflows</span>
            </div>
          </div>
        </div>
        <div className="bg-circle-1 bg-circle" aria-hidden="true"></div>
        <div className="bg-circle-2 bg-circle" aria-hidden="true"></div>
        <div className="bg-circle-3 bg-circle" aria-hidden="true"></div>
        <div className="bg-circle-4 bg-circle" aria-hidden="true"></div>
      </header>

      <section id="platform" className="opw-platform-intro">
        <div className="container px-5 py-5">
          <div className="row gx-5 align-items-end">
            <div className="col-lg-7">
              <span className="opw-section-kicker">ONE MODULAR PLATFORM</span>
              <h2 className="display-4 fw-bold mb-0">Start with one challenge.<br/>Expand on your terms.</h2>
            </div>
            <div className="col-lg-5">
              <p className="opw-section-copy mb-0">Aptinusa brings business capabilities together while keeping controls visible. Enable channels and modules as their official access, authorization, and readiness checks are completed.</p>
            </div>
          </div>
        </div>
      </section>

      {sections.map((section) => (
        <section id={section.id} key={section.id} className="opw-feature-section">
          <div className="container px-5">
            <div className="row gx-5 align-items-center">
              <div className={`col-lg-6 ${section.reverse ? "order-lg-2" : ""}`}>
                <div className="p-5">
                  <img className="img-fluid rounded-circle opw-circle-image" src={section.image} alt={section.alt} loading="lazy"/>
                </div>
              </div>
              <div className={`col-lg-6 ${section.reverse ? "order-lg-1" : ""}`}>
                <div className="p-5">
                  <span className="opw-section-kicker">{section.kicker}</span>
                  <h2 className="display-4 fw-bold">{section.title}</h2>
                  <p className="opw-section-copy">{section.text}</p>
                  <ul className="list-unstyled mt-4 mb-4">
                    {section.bullets.map((bullet) => <li key={bullet} className="mb-2"><CheckCircle2 size={17} className="me-2 text-success"/>{bullet}</li>)}
                  </ul>
                  <Link className="opw-section-link" href={section.href}>{section.link} <ArrowRight size={17}/></Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section id="how-it-works" className="opw-steps-section py-5">
        <div className="container px-5 py-4">
          <div className="text-center mb-5">
            <span className="opw-section-kicker">A CONTROLLED PATH TO LAUNCH</span>
            <h2 className="display-4 fw-bold mb-3">Connect with confidence.</h2>
            <p className="opw-section-copy mx-auto" style={{maxWidth: 760}}>A predictable path from workspace setup to production—without presenting an unverified connector as live.</p>
          </div>
          <div className="row gx-4 gy-4">
            <div className="col-md-4"><article className="opw-step-card h-100 p-4"><span className="opw-step-number">01</span><h3 className="h4 fw-bold mt-4">Set up your workspace</h3><p className="mb-0">Define your organization, team access, modules, and operating boundaries.</p></article></div>
            <div className="col-md-4"><article className="opw-step-card h-100 p-4"><span className="opw-step-number">02</span><h3 className="h4 fw-bold mt-4">Connect official channels</h3><p className="mb-0">Authorize supported integrations and review exactly what each connection can access.</p></article></div>
            <div className="col-md-4"><article className="opw-step-card h-100 p-4"><span className="opw-step-number">03</span><h3 className="h4 fw-bold mt-4">Test before activation</h3><p className="mb-0">Validate workflows, usage limits, approvals, and human handoff before going live.</p></article></div>
          </div>
        </div>
      </section>

      <section className="opw-cta-band">
        <div className="container px-5">
          <span className="aptinusa-eyebrow">BUILT FOR SMALL TEAMS TO ENTERPRISE</span>
          <h2>Keep the intelligence.<br/>Keep control of your business.</h2>
          <p>Explore Aptinusa's workspace and platform capabilities. Production connections are enabled only after end-to-end verification.</p>
          <Link className="btn btn-primary btn-xl rounded-pill" href="/dashboard/">Open customer workspace <ArrowRight size={17} className="ms-2"/></Link>
        </div>
      </section>

      <footer className="py-5 bg-black text-white">
        <div className="container px-5 text-center">
          <Link href="/" className="d-inline-flex align-items-center justify-content-center gap-2 text-white text-decoration-none fw-bold"><Bot size={24}/> APTINUSA</Link>
          <p className="small mt-3 mb-0">Adaptive Intelligence. Connected Business.</p>
          <div className="opw-footer-links">
            <Link href="/api/">API documentation</Link>
            <Link href="/connectors/">Integrations</Link>
            <Link href="/agents/">AI architecture</Link>
            <Link href="/status/">Service status</Link>
            <Link href="/admin/">Admin preview</Link>
          </div>
          <p className="opw-footer-note mb-0">Product preview. Authentication, billing, and external messaging are not represented as live until their production flows are verified.</p>
          <p className="small text-white-50 mt-4 mb-0">© {new Date().getFullYear()} Aptinusa. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
