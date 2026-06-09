/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/ai/upgrade",
        destination: "/planos",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
