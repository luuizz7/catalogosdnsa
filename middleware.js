import { NextResponse } from "next/server";

// lista de IPs permitidos
const allowedIPs = ["177.52.244.45"]; 

export function middleware(req) {
  // pega o IP do visitante
  const visitorIP =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for") ||
    req.ip ||
    "";

  // se o IP nao estiver na lista, bloqueia
  if (!allowedIPs.some(ip => visitorIP.includes(ip))) {
    return new NextResponse(
      "<h1>Acesso restrito</h1><p>IP nao autorizado.</p>",
      { status: 200, headers: { "content-type": "text/html" } } // evita problemas com operadoras
    );
  }

  // se o IP estiver ok, libera acesso
  return NextResponse.next();
}

// aplica para todas as rotas
export const config = {
  matcher: "/:path*",
};
