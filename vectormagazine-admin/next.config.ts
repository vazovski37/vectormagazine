import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize builds for low-memory environments
  poweredByHeader: false,
  compress: true,

  // Ignore typescript/eslint errors during build to save memory
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
