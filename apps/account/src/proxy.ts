import { NextRequest, NextResponse } from "next/server";

import { AnsospaceSDK } from "@ansospace/sdk";

import { MiddlewareStorage } from "./lib/ansospace/middlewareStorage";

// 1. Specify public routes (all others are protected)
const publicRoutes = ["/login", "/signup", "/forgot-password", "/verify-email"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Skip middleware for static assets and Next.js internal routes
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.startsWith("/images") ||
    path.startsWith("/icons") ||
    /\.(png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot)$/i.test(path)
  ) {
    return NextResponse.next();
  }

  // 2. Check if the current route is public
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Initialize SDK with MiddlewareStorage
  const res = NextResponse.next();
  const storage = new MiddlewareStorage(req, res);
  const sdk = new AnsospaceSDK({
    baseUrl: process.env.USER_SERVICE_URL || "http://localhost:4000",
    storage,
  });

  // 4. Verification Optimization: Check if tokens exist before calling API
  const accessToken = req.cookies.get("authorization")?.value;
  const refreshToken = req.cookies.get("refresh-token")?.value;

  let isAuthenticated = false;
  let userData: unknown = null;

  if (accessToken || refreshToken) {
    try {
      const profileRes = await sdk.auth.getMyAccessProfile();
      if (profileRes.status === "success") {
        isAuthenticated = true;
        userData = profileRes.data;
      }
    } catch {
      // Session verification failed or expired; proceed as unauthenticated.
      // The SDK handles clearing session state internally where appropriate.
      isAuthenticated = false;
    }
  }

  // 5. Redirect to /login if the user is not authenticated and route is not public
  if (!isPublicRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 6. Redirect to / if the user is authenticated and on a public route
  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  // 7. Optimization: Pass user data and updated cookies to downstream RSCs
  // We need to pass the updated request headers to NextResponse.next
  if (userData) {
    req.headers.set("x-ansospace-user", JSON.stringify(userData));
    req.headers.set("x-ansospace-auth-status", "authenticated");
  } else {
    req.headers.set("x-ansospace-auth-status", "unauthenticated");
  }

  const finalResponse = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  // 8. Copy cookies from the storage response to the final response
  // This ensures the browser receives the updated cookies (e.g. after refresh)
  const storageResponse = storage.getResponse();
  storageResponse.cookies.getAll().forEach((cookie) => {
    finalResponse.cookies.set(cookie.name, cookie.value, {
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      path: cookie.path,
      sameSite: cookie.sameSite,
      expires: cookie.expires,
      maxAge: cookie.maxAge,
    });
  });

  return finalResponse;
}

// Routes Proxy should not run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
