export default function handler(req, res) {
  const visitorIP =
    req.headers['x-real-ip'] ||
    req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress ||
    "";

  res.status(200).json({ ip: visitorIP });
}
