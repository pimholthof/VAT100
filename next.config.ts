import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // @react-pdf/renderer needs these aliases for server-side rendering
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
