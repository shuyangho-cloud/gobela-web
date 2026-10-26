import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production references come from private Storage, never from Git or an upload bundle.
  outputFileTracingIncludes: process.env.SUPERBRAIN_BUNDLED_ASSETS === 'true'
    ? {'/api/superbrain/**':['./.private-superbrain-assets/**/*']} : {},
};

export default nextConfig;
