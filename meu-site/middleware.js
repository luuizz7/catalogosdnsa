import { NextResponse } from "next/server";

// Lista de IPs públicos permitidos da empresa
const allowedIPs = [
  "177.52.244.45", // IP 1 da empresa
  "187.95.167.68", // IP 2 da empresa
];

export function middleware(req) {
  // Captura o IP real que chega no Vercel
  const visitorIP =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for") ||
    "";

  // Log para monitorar tentativas
  console.log(`[Middleware] IP visitante: ${visitorIP}`);

  // Bloqueia se não estiver na lista
  if (!allowedIPs.includes(visitorIP)) {
    return new NextResponse(
      `<h1>Acesso restrito</h1>
       <p>Seu IP (${visitorIP}) não está autorizado.</p>`,
      {
        status: 200,
        headers: { "content-type": "text/html" },
      }
    );
  }

  // Libera o acesso
  return NextResponse.next();
}

// Aplica a todas as rotas do site
export const config = {
  matcher: "/:path*",
};
