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
//https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/73859536-d035-4db9-b2f8-a9055bca3940