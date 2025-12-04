// middleware.js
import { NextResponse } from "next/server";

// middleware para liberar acesso apenas para um IP específico
export function middleware(req) {
  const allowedIP = "177.52.244.45"; // IP autorizado
  const visitorIP =
    req.headers.get("x-real-ip") ||       // IP real se houver
    req.headers.get("x-forwarded-for") || // IP passado por proxy
    req.ip ||                             // IP do request
    "";

  // se o IP não for permitido, retorna uma página segura
  if (!visitorIP.includes(allowedIP)) {
    return new NextResponse(
      "<h1>Acesso restrito</h1><p>IP nao autorizado.</p>",
      { 
        status: 200, // evita problemas com operadoras brasileiras
        headers: { "content-type": "text/html" } 
      }
    );
  }

  // se o IP estiver ok, continua normalmente
  return NextResponse.next(); // ESSENCIAL para não quebrar o fluxo
}

// define para quais rotas o middleware será aplicado
export const config = {
  matcher: "/:path*", // aplica para todas as rotas
};
