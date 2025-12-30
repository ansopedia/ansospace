import { AuthProvider, AuthProvidersProps } from "../../components/providers/AuthProvider";
import { ANSOSPACE_CONFIG } from "../../lib/ansospace/config";

const AuthLayout = ({ children }: AuthProvidersProps) => {
  return <AuthProvider baseUrl={ANSOSPACE_CONFIG.baseUrl}>{children}</AuthProvider>;
};

export default AuthLayout;
