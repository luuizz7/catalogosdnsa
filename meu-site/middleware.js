import { NextResponse } from "next/server";

export function middleware(req) {
  const visitorIP =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for") ||
    "";

  return new NextResponse(
    `<h1>Seu IP:</h1><p>${visitorIP}</p>`,
    { status: 200, headers: { "content-type": "text/html" } }
  );
}

export const config = {
  matcher: "/:path*",
};
