import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ["image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 50,
  },
  experimental: {
    optimizePackageImports: ["clsx"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/writer-dashboard/:name/create-post/:path*",
        destination: "/author-workspace/create-post",
      },
      {
        source: "/writer-dashboard/:name/:section/create-post/:path*",
        destination: "/author-workspace/create-post",
      },
      {
        source: "/writer-dashboard/:name/create-post",
        destination: "/author-workspace/create-post",
      },
      {
        source: "/writer-dashboard/:name/:section/create-post",
        destination: "/author-workspace/create-post",
      },
    ];
  },
};

export default nextConfig;
