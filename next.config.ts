import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    taint: true,
  },
  images: {
    remotePatterns: [
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "imagedelivery.net" },
    ],
  },
  // 외부 api 호출시 logging 실시
  logging: {
    fetches: { fullUrl: true },
  },
  // 빌드 시 ESLint 오류 무시
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
};

export default nextConfig;
