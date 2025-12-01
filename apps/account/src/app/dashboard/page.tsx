import { Suspense } from "react";

import { AnsospaceSDK, InMemoryStorageAdapter, TokenManager } from "@ansospace/sdk";
import { IApiResponse } from "@ansospace/types";

import { Users } from "../../components/user";
import { env } from "../../lib/env";

let response: IApiResponse<{
  permissions: string[];
}>;

const page = async () => {
  // For server-side, create SDK instance directly
  const sdk = new AnsospaceSDK({
    baseUrl: env.USER_SERVICE_URL,
    storage: new TokenManager(new InMemoryStorageAdapter()), // Server-side uses in-memory
  });
  response = await sdk.auth.getPermissions();

  if (response.status === "success") {
    return <div>Dashboard server side {JSON.stringify(response)}</div>;
  }

  return (
    <div>
      <Suspense fallback="Loading users">
        <Users />
      </Suspense>
      {/* Error: {response.message} */}
      <p>Check the response for more details.</p>
      <div>{JSON.stringify(response)}</div>
    </div>
  );
};

export default page;
