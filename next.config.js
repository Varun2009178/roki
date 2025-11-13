/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable API routes
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}

module.exports = nextConfig

