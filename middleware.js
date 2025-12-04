export function middleware(req) {
  const allowedIP = "177.52.244.45";
  const visitorIP = req.ip || req.headers.get("x-forwarded-for");

  if (visitorIP !== allowedIP) {
    return new Response("acesso restrito", { status: 403 });
  }

  return;
}

export const config = {
  matcher: "/:path*",
};
