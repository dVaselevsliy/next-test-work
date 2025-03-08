import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: "/next-test-work", 
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
