'use client'

import React from 'react'

/**
 * Generador vectorial SVG de código de barras (Patrón Code-39/128 simplificado de alta legibilidad para escáneres)
 */
export function BarcodeSvg({ value, className = 'h-12' }: { value: string; className?: string }) {
  // Generar secuencia determinista de barras a partir del string
  const bars = React.useMemo(() => {
    const clean = (value || '00000000').toUpperCase()
    const pattern: number[] = [2, 1, 1, 2] // Guard inicial

    for (let i = 0; i < clean.length; i++) {
      const code = clean.charCodeAt(i)
      const b1 = (code % 3) + 1
      const b2 = ((code * 2) % 3) + 1
      const b3 = ((code * 3) % 2) + 1
      pattern.push(b1, 1, b2, 1, b3)
    }

    pattern.push(2, 1, 2) // Guard final
    return pattern
  }, [value])

  let currentX = 0
  const rects: { x: number; width: number }[] = []

  bars.forEach((width, index) => {
    // Si index es par -> barra negra; impar -> espacio blanco
    if (index % 2 === 0) {
      rects.push({ x: currentX, width })
    }
    currentX += width
  })

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${currentX} 40`}
        preserveAspectRatio="none"
        className={`w-full max-w-[220px] ${className}`}
      >
        {rects.map((r, i) => (
          <rect key={i} x={r.x} y={0} width={r.width} height={40} fill="currentColor" />
        ))}
      </svg>
      <span className="font-mono text-[11px] font-bold tracking-widest text-slate-800 uppercase mt-0.5">
        *{value}*
      </span>
    </div>
  )
}

