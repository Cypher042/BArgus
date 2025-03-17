import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
customKey : process.env.MONGODB_URI,
  },
};

module.exports = nextConfig
