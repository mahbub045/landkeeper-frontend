import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'api.landkeeper.co.uk',
      },
      {
        protocol: 'https',
        hostname: 'api.landkeeper.co.uk',
      },
    ],
  },
};

export default nextConfig;
