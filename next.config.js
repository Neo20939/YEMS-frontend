const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-slot'],
  },
  
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'internal.yeshuahigh.com' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },

  async rewrites() {
    const isProduction = process.env.NODE_ENV === 'production';
    const backendBaseUrl = isProduction 
      ? 'https://internal.yeshuahigh.com/shdhfh@s/api'
      : (process.env.NEXT_PUBLIC_API_LOCAL_URL || 'http://localhost/shdhfh@s/api');
    
    return [
      { source: '/api/external/:path*', destination: `${backendBaseUrl}/api/:path*` },
      { source: '/api/:path*', destination: `${backendBaseUrl}/api/:path*` },
    ]
  },
}

module.exports = nextConfig