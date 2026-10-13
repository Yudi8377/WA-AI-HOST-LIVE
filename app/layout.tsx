import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "WA AI HOST LIVE — Commerce Command Center", description: "Pusat kendali AI untuk percakapan, katalog, dan live commerce lintas kanal.", applicationName: "WA AI HOST LIVE" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="id"><body>{children}</body></html>; }
