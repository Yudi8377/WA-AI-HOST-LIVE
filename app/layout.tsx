import type { Metadata } from "next";
import "./globals.css";
import "./aptinusa.css";
import "./aptinusa-template-ui.css";
export const metadata: Metadata = {
  title: "Aptinusa — Adaptive Intelligence. Connected Business.",
  description: "Aptinusa is building a connected AI business workspace for customer engagement, commerce workflows, integrations and governed multi-agent automation.",
  applicationName: "Aptinusa",
  robots: { index: true, follow: true }
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="id"><body>{children}</body></html>; }
