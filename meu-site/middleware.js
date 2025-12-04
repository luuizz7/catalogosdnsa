import { NextResponse } from "next/server";

// lista de IPs permitidos
const allowedIPs = ["177.52.244.45", "187.95.167.68"];

export function middleware(req) {
  // pega o IP que chega no Vercel
  const visitorIP =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for") ||
    "";

  // se não estiver na lista, bloqueia
  if (!allowedIPs.includes(visitorIP)) {
    return new NextResponse(
      "<h1>Acesso restrito</h1><p>IP não autorizado.</p>",
      { status: 200, headers: { "content-type": "text/html" } }
    );
  }

  // se estiver na lista, deixa passar
  return NextResponse.next();
}

// aplica o middleware em todas as rotas
export const config = {
  matcher: "/:path*",
};
