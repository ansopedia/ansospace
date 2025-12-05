import { nextConfig } from "@ansospace/eslint-config/next-js";
import { turboConfig } from "@ansospace/eslint-config/turbo";

const config = [...turboConfig, ...nextConfig];

export default config;
