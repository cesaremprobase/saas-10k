import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SaaS Factory V5 - Mission Control',
  description: 'Plantilla de producción para aplicaciones SaaS asistidas por IA.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body className="antialiased min-h-screen bg-slate-950 font-sans">{children}</body>
    </html>
  )
}
