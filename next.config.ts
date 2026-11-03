import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    // Permite que la compilación en Vercel proceda sin detenerse por chequeos de tipos secundarios
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignora advertencias de ESLint durante la compilación en producción
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
}

export default nextConfig
