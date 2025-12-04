import { NextResponse } from "next/server";

export function middleware(req) {
  // Lista de IPs permitidos (IPs públicos da empresa)
  const allowedIPs = [
    "177.52.244.45", // IP 1 da empresa
    "187.95.167.68", // IP 2 da empresa
  ];

  // Captura o IP real que chega no Vercel
  const visitorIP =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for") ||
    "";

  // Bloqueia se não estiver na lista
  if (!allowedIPs.includes(visitorIP)) {
    return new NextResponse(
      "<h1>Acesso restrito</h1><p>IP não autorizado.</p>",
      { status: 200, headers: { "content-type": "text/html" } }
    );
  }

  return NextResponse.next(); // libera acesso
}

export const config = {
  matcher: "/:path*", // aplica a todas as rotas
};
