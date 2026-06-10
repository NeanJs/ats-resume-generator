import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/resume/(.*)/print",
  "/tailor",
]);

export default clerkMiddleware(async (auth, req) => {
  const isApiRoute = req.nextUrl.pathname.startsWith("/api");

  if (isApiRoute) return;
  if (!isPublicRoute(req)) await auth.protect();
});

export const config = {
  matcher: ["/((?!_next|static|.*\\..*).*)"],
};
