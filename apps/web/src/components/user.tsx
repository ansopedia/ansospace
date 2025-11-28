"use client";

import { useEffect, useState } from "react";

import { useAuthContext } from "@ansospace/react";
import { User } from "@ansospace/types";

const url = "/api/v1/users";
type IUserResponse = { totalUsers: string; user: User[] };
export const Users = () => {
  const { sdk } = useAuthContext();
  const [user, setUser] = useState<IUserResponse>();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await sdk.client.GET<IUserResponse>(url);
      if (user.status === "success") {
        setUser(user.data);
      }
    };

    fetchUser();
  }, [sdk]);

  return (
    <div>
      {user?.totalUsers}
      {/* Users ${userId?.toString()} */}
      <div>
        <p>{JSON.stringify(user?.user)}</p>
      </div>
      <div>{JSON.stringify(user)}</div>
      {/* <User /> */}
    </div>
  );
};
