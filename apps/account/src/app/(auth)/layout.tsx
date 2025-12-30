import { ReactNode } from "react";

import { AuthProvider } from "../../components/providers/AuthProvider";
import { ANSOSPACE_CONFIG } from "../../lib/ansospace/config";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return <AuthProvider baseUrl={ANSOSPACE_CONFIG.baseUrl}>{children}</AuthProvider>;
};

export default AuthLayout;
