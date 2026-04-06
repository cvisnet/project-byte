import type { NextConfig } from "next";
import path from 'node:path'

const nextConfig: NextConfig = {
  turbopack: {
    // absolute path; do not allow references outside this root
    root: path.resolve(__dirname),
  }
};

export default nextConfig;
