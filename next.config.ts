import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repositoryBasePath = isGitHubPages ? "/WA-AI-HOST-LIVE" : "";

const nextConfig: NextConfig = {
  ...(isGitHubPages ? { output: "export" as const } : {}),
  trailingSlash: true,
  basePath: repositoryBasePath || undefined,
  assetPrefix: isGitHubPages ? "/WA-AI-HOST-LIVE/" : undefined,
  poweredByHeader: false,
  reactStrictMode: true
};

export default nextConfig;
