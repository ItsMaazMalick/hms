import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const publicRoutes = ["/auth/login", "/auth/register"];
  const token = cookies().get("auth-token")?.value;

  if (!publicRoutes.includes(pathname) && !token) {
    return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
  }
  if (publicRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }
}

export const config = {
  matcher: [
    "/",
    "/auth/login",
    "/auth/register",
    "/dashboard",
    "/dashboard/:path*",
  ],
};
