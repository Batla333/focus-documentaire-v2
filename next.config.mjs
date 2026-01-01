/** @type {import('next').NextConfig} */
const nextConfig = {
  // Votre option existante
  reactCompiler: true,
  
  // La correction pour les images Sanity
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
};

export default nextConfig;