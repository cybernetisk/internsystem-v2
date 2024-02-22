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
};

export default nextConfig;
