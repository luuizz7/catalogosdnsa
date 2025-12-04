export function middleware(req) {
  const allowedIP = "177.52.244.45";

  // vercel envia o ip real no x-forwarded-for
  let visitorIP = req.headers.get("x-forwarded-for") || "";
  
  // se vier mais de um ip, pega só o primeiro
  visitorIP = visitorIP.split(",")[0].trim();

  // se nao for o ip permitido → BLOQUEIA
  if (visitorIP !== allowedIP) {
    return new Response("acesso restrito", { status: 403 });
  }

  // se for o ip certo, permite acesso
  return;
}

export const config = {
  matcher: "/:path*",
};
