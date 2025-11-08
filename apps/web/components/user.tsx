"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@ansospace/auth";
import { User } from "@ansospace/types";

const url = "/api/v1/users";
type IUserResponse = { totalUsers: string; user: User[] };
const Users = () => {
  const { userId, apiClient } = useAuth();
  const [user, setUser] = useState<IUserResponse>();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await apiClient.GET<IUserResponse>(url);
      if (user.status === "success") {
        setUser(user.data);
      }
      console.log(user);
    };

    fetchUser();
  }, [apiClient]);

  console.log("user", user);

  if (!user?.totalUsers) return "loading";

  return (
    <div>
      {user?.totalUsers}
      Users ${userId?.toString()}
      <div>
        <p>{JSON.stringify(user?.user)}</p>
      </div>
      <br />
      <br />
      <br />
      <div>{JSON.stringify(user)}</div>
      {/* <User /> */}
    </div>
  );
};

export default Users;
