"use client";

import { useUser } from "@ansospace/react";

export const Users = () => {
  const { user } = useUser();

  return <div>{user.kind}</div>;
};
