"use client";

import { useAuth } from "@ansospace/auth";

const Page = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <div>Unauthorized</div>;
  }

  return <div>Dashboard {"" + isAuthenticated}</div>;
};

export default Page;
