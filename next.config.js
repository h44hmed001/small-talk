/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  images: {
    domains: [
      "firebasestorage.googleapis.com",
    ],
},
eslint:false,
rules: {
  // 'off' turns off the rule
  'jsx-a11y/anchor-is-valid': 'off',
  // Add more rules as needed
},
eslint: {
  ignoreDuringBuilds: true,
},
}

module.exports = nextConfig
