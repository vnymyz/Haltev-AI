import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@react-pdf/renderer"],
  // The knowledge base and images are read from disk at runtime (system prompt + invoice PDF).
  outputFileTracingIncludes: {
    "/api/chat": ["./docs/haltev_knowledge_base.md"],
    "/api/invoice/[id]/pdf": ["./public/Logo-Haltev.png", "./public/Qris-Haltev.png"],
  },
};

export default nextConfig;
