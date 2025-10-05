"use client";

import { useAuth } from "@ansospace/auth";

const User = () => {
  const { userId } = useAuth();
  return <div>{userId?.toString()}</div>;
};

export default User;
