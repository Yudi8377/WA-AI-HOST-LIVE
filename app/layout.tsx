import type { Metadata } from "next";
import "./globals.css";
import "./aptinusa.css";
import "./aptinusa-template-ui.css";
import "./one-page-wonder-scoped.css";
export const metadata: Metadata = {
  title: "Aptinusa — Adaptive Intelligence. Connected Business.",
  description: "Aptinusa is building a connected AI business workspace for customer engagement, commerce workflows, integrations and governed multi-agent automation.",
  applicationName: "Aptinusa",
  robots: { index: true, follow: true }
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="id"><head><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link href="https://fonts.googleapis.com/css?family=Catamaran:100,200,300,400,500,600,700,800,900" rel="stylesheet"/><link href="https://fonts.googleapis.com/css?family=Lato:100,100i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet"/></head><body>{children}</body></html>; }
