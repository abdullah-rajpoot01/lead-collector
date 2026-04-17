import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    output: 'export',
  // Optional: Recommended for static hosts to prevent image optimization errors
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
