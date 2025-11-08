/**
 * @ansospace/auth - Main entry point
 *
 * WARNING: This entry point includes both client and server code.
 * For better compatibility with Next.js App Router:
 *
 * - Use `@ansospace/auth/client` for client components (hooks, providers)
 * - Use `@ansospace/auth/server` for server components and API routes
 * - Only use this main entry point if you know what you're doing
 */

// Re-export everything (this may cause issues in server components)
export * from "./client";
export * from "./server";
