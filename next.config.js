/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize package imports for faster compilation
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-slot'],
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
}

module.exports = nextConfig