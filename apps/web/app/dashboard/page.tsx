import { env } from "../../lib/env";
import { initializeServerAuth } from "../../lib/serverAuth";
import { User } from "./User";

const page = async () => {
  // Initialize AuthManager with server-side cookie support
  const authManger = await initializeServerAuth(env.USER_SERVICE_URL);

  const response = await authManger.auth.getPermissions();

  if (response.status === "success") {
    return <div>Dashboard server side {JSON.stringify(response)}</div>;
  }

  return (
    <div>
      <User />
      Error: {response.message}
      <p>Check the response for more details.</p>
      <div>{JSON.stringify(response)}</div>
    </div>
  );
};

export default page;
