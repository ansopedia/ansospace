"use client";

import { useEffect, useState } from "react";

import { AnsospaceAuth } from "@ansospace/auth";
import { User } from "@ansospace/types";

const url = "/api/v1/users";
type IUserResponse = { totalUsers: string; user: User[] };
export const Users = () => {
  // const { userId } = useAuth();
  const [user, setUser] = useState<IUserResponse>();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await AnsospaceAuth.instance.apiClient.GET<IUserResponse>(url);
      if (user.status === "success") {
        setUser(user.data);
      }
      console.log(user);
    };

    fetchUser();
  }, []);

  console.log("user", user);

  // if (!user?.totalUsers) return "loading";

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
