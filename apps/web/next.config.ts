import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@ansospace/ui"],
  reactCompiler: true,
};

export default nextConfig;
