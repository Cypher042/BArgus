/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'rukminim2.flixcart.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.amazon.in',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.flipkart.com',
        pathname: '/**',
      }
    ],
  },
}

module.exports = nextConfig