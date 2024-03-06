/** @type {import('next').NextConfig} */
const nextConfig = {
  // basePath: "/pages/home",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/pages/home",
        permanent: true,
        basePath: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  experimental: {
    taint: true,
  },
};

export default nextConfig;
