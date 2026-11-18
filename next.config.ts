import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1280, 1600, 1920, 2560],
    imageSizes: [96, 160, 256, 384],
    qualities: [60, 75, 82],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
  poweredByHeader: false,
  async redirects() {
    return [
      { source: "/about", destination: "/contact", permanent: true },
      { source: "/services", destination: "/contact", permanent: true },
    ];
  },
};

export default nextConfig;
