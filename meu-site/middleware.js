import { NextResponse } from "next/server";

// IPs públicos permitidos
const allowedIPs = [
  "177.52.244.45", // IP da loja
  "187.95.167.68", // outro IP autorizado
];

export function middleware(req) {
  const visitorIP =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for") ||
    req.ip ||
    "";

  if (!allowedIPs.some(ip => visitorIP.includes(ip))) {
    // HTML personalizado de acesso negado
    const html = `
      <!DOCTYPE html>
      <html lang="pt-br">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Acesso Negado</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              display: flex; 
              flex-direction: column; 
              justify-content: center; 
              align-items: center; 
              height: 100vh; 
              background: #f8f8f8; 
              margin: 0; 
            }
            h1 { color: #e74c3c; }
            p { color: #333; }
            a { color: #3498db; text-decoration: none; margin-top: 20px; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <h1>Acesso Negado</h1>
          <p>Seu IP não está autorizado a acessar este site.</p>
          <a href="https://catalogodnsa.vercel.app/">Voltar para a página inicial</a>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      status: 200,
      headers: { "content-type": "text/html" },
    });
  }

  // IP permitido → continua normalmente
  return NextResponse.next();
}

// aplica em todas as rotas
export const config = {
  matcher: "/:path*",
};
