import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gqqfqdbehqujcdqsudgh.supabase.co',
        pathname: '/storage/v1/object/sign/**',
      },
    ],
  },
  eslint: {
    // Disable ESLint during `next build`
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
