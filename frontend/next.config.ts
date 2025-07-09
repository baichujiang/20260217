import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/review-images/**',
      },
      {
        protocol: 'https',
        hostname: 'your-api-domain.com', // TODO: production url
        pathname: '/review-images/**',
      },
    ],
  },
  eslint: {
    // Disable ESLint during `next build`
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
