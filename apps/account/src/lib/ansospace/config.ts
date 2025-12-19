import { env } from "../env";

export const ANSOSPACE_CONFIG = {
  baseUrl: env.USER_SERVICE_URL,
} as const;
