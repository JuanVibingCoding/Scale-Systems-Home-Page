import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['motion', 'framer-motion'],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
