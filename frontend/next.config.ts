import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during `next build`
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
