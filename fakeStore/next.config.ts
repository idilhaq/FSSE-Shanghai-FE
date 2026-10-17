import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow optimizing images served from the DummyJSON CDN.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.dummyjson.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
