import { AnsospaceSDK } from "@ansospace/sdk";

import { ANSOSPACE_CONFIG } from "./config";
import { NextServerStorage } from "./storage";

// Helper to get a ready-to-use SDK on the server
export const getServerSdk = async () => {
  return new AnsospaceSDK({
    baseUrl: ANSOSPACE_CONFIG.baseUrl,
    storage: new NextServerStorage(), // Plug in the cookie adapter
  });
};
