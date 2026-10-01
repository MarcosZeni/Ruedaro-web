import type { NextConfig } from "next";

// Cabeceras de seguridad para todas las páginas. HSTS no va acá: lo pone nginx,
// que es quien termina el TLS. La Content-Security-Policy queda para cuando haya
// páginas reales, porque con Next necesita nonces para los scripts inline.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // Build autocontenido para la imagen de Docker: solo lo que usa el server.
  output: "standalone",

  // No anunciar "X-Powered-By: Next.js".
  poweredByHeader: false,

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
