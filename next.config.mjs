/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  async rewrites() {
    return [
      // If the incoming request already includes /api/v1/, don't add v1 again
      {
        source: "/api/v1/:path*",
        destination:
          "https://polsight-backend-production.up.railway.app/api/v1/:path*",
      },
      // Normal proxy route
      {
        source: "/api/:path*",
        destination:
          "https://polsight-backend-production.up.railway.app/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;