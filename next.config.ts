import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sharp", "bcryptjs"],
  outputFileTracingIncludes: {
    "/api/cms": ["./node_modules/sharp/**/*"],
  },
  images: {
    qualities: [70, 85],
  },
};

export default nextConfig;
