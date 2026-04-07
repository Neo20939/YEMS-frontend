/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  // CORS placeholder for future use
  // yeshuacorsissue: {
  //   allowedOrigins: ['https://kennedi-ungnostic-unconvulsively.ngrok-free.dev'],
  //   enabled: false,
  // },
}

module.exports = nextConfig
