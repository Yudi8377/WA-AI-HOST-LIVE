import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const repositoryBasePath = isGitHubPages ? "/WA-AI-HOST-LIVE" : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: repositoryBasePath || undefined,
  assetPrefix: isGitHubPages ? "/WA-AI-HOST-LIVE/" : undefined,
  poweredByHeader: false,
  reactStrictMode: true
};

export default nextConfig;
