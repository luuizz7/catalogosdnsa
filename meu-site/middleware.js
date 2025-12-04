import { NextResponse } from "next/server";

export function middleware(req) {
  // captura o IP real
  const visitorIP =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for") ||
    "";

  // mostra no log qual IP está chegando
  console.log(`[Middleware] IP visitante: ${visitorIP}`);

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
