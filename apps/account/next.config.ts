import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@ansospace/ui"],
  reactCompiler: true,
  cacheComponents: true,
};

export default nextConfig;
