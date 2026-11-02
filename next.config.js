/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  // env: { NEXT_PUBLIC_BASE_IMAGE_URL: "/demo-assets" },
  async headers() {
    return [{ source: "/api/:path*", headers: [{ key: "Cache-Control", value: "no-store" }] }];
  },
};
module.exports = (phase) => ({
  ...nextConfig,
  distDir: phase === require("next/constants").PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
});
