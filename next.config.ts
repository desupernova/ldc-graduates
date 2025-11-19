import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";
// Cambia esto si el nombre del repo en GitHub es diferente
const repoName = "ldc-graduates";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    // Requerido para export estático en GitHub Pages
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? `/${repoName}` : "",
  },
  // Ajusta rutas cuando se sirve bajo /<repo>
  ...(isGithubPages
    ? {
        basePath: `/${repoName}`,
        assetPrefix: `/${repoName}/`,
      }
    : {}),
};

export default nextConfig;
