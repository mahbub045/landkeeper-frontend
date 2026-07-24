import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.landkeeper.co.uk',
      },
      {
        protocol: 'http',
        hostname: 'api.landkeeper.co.uk',
      },
    ],
  },
};

export default nextConfig;
