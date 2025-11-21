import { Suspense } from "react";

import { AnsospaceAuth } from "@ansospace/auth";
import { IApiResponse } from "@ansospace/types";

import { Users } from "../../../components/user";

let response: IApiResponse<{
  permissions: string[];
}>;

const page = async () => {
  try {
    // const authManger = AnsospaceAuth.init({ baseUrl: "http://localhost:8000/" });
    response = await AnsospaceAuth.instance.auth.getPermissions();
    // response = await AnsospaceAuth.instance.apiClient.GET("/api/v1/permissions");
    console.log({ response });
  } catch (error) {
    console.log({ error });
  }
  // const authManger = AuthManager.instance;

  // if (response.status === "success") {
  //   return <div>Dashboard server side {JSON.stringify(response)}</div>;
  // }

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
