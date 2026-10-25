import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {'/api/superbrain/**':['./.private-superbrain-assets/**/*']},
};

export default nextConfig;
