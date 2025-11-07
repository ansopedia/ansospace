import { AuthManager } from "../core/AuthManager";

export const getServerSession = async (request: Request) => {
  const config = AuthManager.instance.config;
  const cookie = request.headers.get("cookie") ?? "";
  const token = cookie
    .split("; ")
    .find((c) => c.startsWith(config.tokenKey + "="))
    ?.split("=")[1];

  if (!token) return null;

  const res = await fetch(`${config.baseUrl}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return null;
  return res.json();
};
