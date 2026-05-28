/** @type {import('next').NextConfig} */
console.log('⚙️ Next.js Build-Time NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL)

const nextConfig = {
  images: { domains: ['lh3.googleusercontent.com'] },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  },
}
module.exports = nextConfig
