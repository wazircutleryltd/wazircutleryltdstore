import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  turbopack: {
    root: process.cwd(),
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'react-icons',
      'framer-motion',
      'recharts',
      'sonner',
      '@tanstack/react-table',
      '@tanstack/react-query',
    ],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000, // 30 days cache for optimized images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
