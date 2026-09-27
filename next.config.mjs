/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '6mb'
    }
  },
  images: {
    formats: ["image/avif", "image/webp"]
  }
};

export default nextConfig;
