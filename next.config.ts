import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
      // Ye line add karne se "Failed to fetch" wala masla hal ho jayega
      allowedOrigins: ["localhost:3000", "192.168.100.9:3000"],
    },
  },
};

export default nextConfig;