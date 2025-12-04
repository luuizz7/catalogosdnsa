export function middleware(req) {
  const allowedIP = "177.52.244.45"; // seu ip
  const forwarded = req.headers.get("x-forwarded-for");

  // pega o primeiro ip da lista x-forwarded-for
  const visitorIP = forwarded?.split(",")[0].trim();

  if (visitorIP !== allowedIP) {
    return new Response("acesso restrito", { status: 403 });
  }

  return;
}

export const config = {
  matcher: "/:path*",
};
