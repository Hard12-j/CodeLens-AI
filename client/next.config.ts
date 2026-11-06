import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
       const backend = process.env.BACKEND_URL || "http://localhost:8080";
       return [
         { source: "/api/:path*", destination: `${backend}/api/:path*` },
         { source: "/oauth2/:path*", destination: `${backend}/oauth2/:path*` },
         { source: "/login/oauth2/:path*", destination: `${backend}/login/oauth2/:path*` },
    ];
  },
};

export default nextConfig;
