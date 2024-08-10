/** @type {import('next').NextConfig} */
const nextConfig = {
  // async redirects() {
  //   return [
  //     {
  //       source: "/pages",
  //       destination: "/",
  //       permanent: true,
  //       basePath: false,
  //     },
  //     {
  //       source: "/pages/main",
  //       destination: "/",
  //       permanent: true,
  //       basePath: false,
  //     },
  //     {
  //       source: "/pages/main/home",
  //       destination: "/",
  //       permanent: true,
  //       basePath: false,
  //     },

  //   ];
  // },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/pages/main/home",
  //       destination: "/"
  //     },

  //     {
  //       source: '/okonomi',
  //       destination: 'https://cybernetisk.github.io/okotools/'
  //     },
  //   ];
  // },
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
