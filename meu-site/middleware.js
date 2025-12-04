import { NextResponse } from "next/server";

const allowedIPs = ["177.52.244.45"]; // seu IP

export function middleware(req) {
  const visitorIP =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for") ||
    req.ip ||
    "";

  if (!allowedIPs.some(ip => visitorIP.includes(ip))) {
    return new NextResponse(
      "<h1>Acesso restrito</h1><p>IP nao autorizado.</p>",
      { status: 200, headers: { "content-type": "text/html" } }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};
