"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@ansospace/auth";
import { User } from "@ansospace/types";

const url = "/api/v1/users";
type IUserResponse = { totalUsers: string; user: User[] };
const Dashboard = () => {
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
      Dashboard ${userId?.toString()}
      {JSON.stringify(user?.user)}
      {/* {JSON.stringify(user)} */}
      {/* <User /> */}
    </div>
  );
};

export default Dashboard;
