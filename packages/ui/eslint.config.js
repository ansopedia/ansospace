import { reactConfig } from "@ansospace/eslint-config/react";
import turboConfig from "@ansospace/eslint-config/turbo";

const config = [...turboConfig, ...reactConfig];

export default config;
