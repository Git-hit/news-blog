import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost', 'https://api.dailytrendnews.in', 'api.dailytrendnews.in'],
  },
  matcher: ['/admin/:path*'],
};

export default nextConfig;