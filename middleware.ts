import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { UserRole } from "@/types/user";

// Define protected route patterns and their required roles
const PROTECTED_ROUTES: Record<string, UserRole> = {
  "/admin": UserRole.ADMIN,
  "/secretary": UserRole.SECRETARY,
  "/instructor": UserRole.INSTRUCTOR,
  "/student": UserRole.STUDENT,
};

// Helper function to check if a path matches a protected route pattern
function matchesProtectedRoute(pathname: string): { matches: boolean; requiredRole?: UserRole } {
  // Check for exact matches first
  if (PROTECTED_ROUTES[pathname]) {
    return { matches: true, requiredRole: PROTECTED_ROUTES[pathname] };
  }

  // Check for nested routes (e.g., /admin/users, /secretary/reports)
  for (const [routePattern, requiredRole] of Object.entries(PROTECTED_ROUTES)) {
    if (pathname.startsWith(`${routePattern}/`)) {
      return { matches: true, requiredRole };
    }
  }

  return { matches: false };
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path matches any protected route
  const { matches: isProtectedRoute, requiredRole } = matchesProtectedRoute(pathname);

  // If route is not protected, allow access
  if (!isProtectedRoute || !requiredRole) {
    return NextResponse.next();
  }

  // Get authState from cookie (which was synced from localStorage)
  const authCookie = request.cookies.get("authState");

  if (!authCookie || !authCookie.value) {
    console.log("No auth cookie found, redirecting to home");
    return NextResponse.redirect(new URL("/", request.url));
  }

  let userRole: UserRole | null = null;

  try {
    // Parse the auth state from the cookie
    const authState = JSON.parse(decodeURIComponent(authCookie.value));
    userRole = authState.user?.role || null;

    // Optional: Check if token is expired
    if (authState.expiresAt && Date.now() > authState.expiresAt) {
      console.log("Token expired, redirecting to home");
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch (error) {
    console.error("Failed to parse auth state from cookie:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If we couldn't get the role, redirect to home
  if (!userRole) {
    console.log("No user role found, redirecting to home");
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Check if user's role matches the required role for this route
  if (userRole !== requiredRole) {
    console.log(
      `Role mismatch: user has ${userRole}, route requires ${requiredRole}, redirecting to home`
    );
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Role matches, allow access
  console.log(`Access granted: user with ${userRole} role accessing ${requiredRole} route`);
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
