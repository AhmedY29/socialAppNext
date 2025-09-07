import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[
      {
        hostname:'img.clerk.com'
      },
      {
        hostname:'cdn-icons-png.flaticon.com'
      }
    ]
  }
};

export default nextConfig;
