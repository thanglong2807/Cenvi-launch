/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Remove instrumentationHook as it's no longer needed
    // instrumentationHook: true,
    // Remove serverComponentsExternalPackages as it's moved
    // serverComponentsExternalPackages: [],
  },
  serverExternalPackages: [], // Add this line instead
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  images: {
    domains: ['localhost', 'api.example.com'], // Add your image domains here
  },
  // Add this to handle the redirects
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'query',
            key: 'code',
          },
        ],
        permanent: false,
        destination: '/:path*',
      },
    ]
  },
};

module.exports = nextConfig;
