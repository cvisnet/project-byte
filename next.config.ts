import type { NextConfig } from "next";
import path from 'node:path'

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseHostname = supabaseUrl
  ? new URL(supabaseUrl).hostname
  : "**.supabase.co";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHostname,
      },
    ],
  },
};

export default nextConfig;
