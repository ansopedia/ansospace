import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@ansospace/ui"],
  reactCompiler: true,
  cacheComponents: true,
  images: {
    domains: ["static.figma.com", "github.githubassets.com", "a.slack-edge.com", "www.notion.so"],
  },
};

export default nextConfig;
