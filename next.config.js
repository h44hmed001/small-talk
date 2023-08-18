/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  images: {
    domains: [
      "firebasestorage.googleapis.com",
    ],
},
eslint:false,
}

module.exports = nextConfig
