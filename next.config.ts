import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["sharp", "bcryptjs"],
  images: {
    qualities: [70, 85],
  },
};

export default nextConfig;
