/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
    unoptimized: true, // 允许未优化的图片（用于用户上传的表情包）
  },
}

module.exports = nextConfig
