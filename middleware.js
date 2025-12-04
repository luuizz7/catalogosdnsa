export function middleware(req) {
  const allowedIP = "177.52.244.45"; // seu ip
  const visitorIP = req.ip || req.headers.get("x-forwarded-for");

  // se o ip NAO for o seu, bloqueia
  if (visitorIP !== allowedIP) {
    return new Response("acesso restrito", { status: 403 });
  }

  // se for seu ip, deixa entrar
  return;
}

export const config = {
  matcher: "/:path*",
};
