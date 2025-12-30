import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { TokenType } from "@ansospace/types";

// 1. Specify public routes (all others are protected)
const publicRoutes = ["/login", "/signup", "/forgot-password", "/verify-email"];

export default async function proxy(req: NextRequest) {
  // 2. Check if the current route is public
  const path = req.nextUrl.pathname;
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const accessToken = (await cookies()).get(TokenType.AUTHORIZATION)?.value;

  // 4. Redirect to /login if the user is not authenticated and route is not public
  if (!isPublicRoute && !accessToken) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 5. Redirect to / if the user is authenticated and on a public route
  if (isPublicRoute && accessToken) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Proxy should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
