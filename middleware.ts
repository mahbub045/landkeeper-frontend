import { getDashboardPath } from "@/lib/navigation";
import type { UserRole } from "@/types/next-auth";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

function hasAccessToPath(role: UserRole | undefined, path: string): boolean {
  if (!role) return false;
  if (role === "ADMIN") return path.startsWith("/admin/");
  return path.startsWith("/client/");
}

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    const userRole = token.role as UserRole | undefined;

    // Redirect root to appropriate dashboard
    if (path === "/" || path === "") {
      return NextResponse.redirect(
        new URL(getDashboardPath(userRole), req.url),
      );
    }

    // Check if accessing wrong path
    if (!hasAccessToPath(userRole, path)) {
      return NextResponse.redirect(
        new URL(getDashboardPath(userRole), req.url),
      );
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/auth/login",
    },
  },
);

export const config = {
  matcher: ["/", "/admin/:path*", "/client/:path*"],
};
