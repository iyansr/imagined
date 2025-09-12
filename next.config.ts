import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: 'localhost',
      },
      {
        hostname: 'cdn-imagined.iyansr.id',
      },
    ],

    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
  },
};

initOpenNextCloudflareForDev();

export default nextConfig;
