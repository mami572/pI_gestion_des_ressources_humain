import { type NextRequest, NextResponse } from "next/server"

const protectedRoutes = ["/dashboard", "/employees", "/attendance", "/leave", "/payroll", "/training"]

export function proxy(request: NextRequest) {
  const userId = request.cookies.get("user_id")?.value
  const pathname = request.nextUrl.pathname

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  if (isProtectedRoute && !userId) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (pathname === "/login" && userId) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|icon|apple-icon|icon.svg).*)"],
}
