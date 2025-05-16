/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable both Webpack and Turbopack
  experimental: {
    turbo: {
      rules: {
        // Add any Turbopack-specific rules here
      },
    },
  },
  webpack: (config) => {
    return config;
  },
  // Performance optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  // Reduce file system operations
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
};

export default nextConfig;
