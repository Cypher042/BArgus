import type { NextConfig } from "next";


const nextConfig: NextConfig = {

};
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
    ],
  },
}

export default nextConfig;
