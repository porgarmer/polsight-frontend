/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        // IMPORTANT: include your backend API prefix here
        destination: "https://polsight-backend-production.up.railway.app/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;