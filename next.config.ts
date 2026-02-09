import type { NextConfig } from "next";
import path from "path";

const projectName = path.basename(__dirname).replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
process.env.NEXT_PUBLIC_APP_NAME = projectName;

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
