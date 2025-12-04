export function middleware(req) {
  const allowedIP = "177.52.244.45"; // seu ip
  const visitorIP = req.ip || req.headers.get("x-forwarded-for");

  // se o ip NAO for o seu, redireciona para outro site
  if (visitorIP !== allowedIP) {
    return Response.redirect("https://google.com", 302); 
  }

  // se for seu ip, deixa entrar normalmente
  return;
}

export const config = {
  matcher: "/:path*",
};
