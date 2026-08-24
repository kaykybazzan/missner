'use client'

import { useState, useRef, useCallback } from 'react'

interface BeforeAfterSliderProps {
  before: string
  after: string
  beforeAlt?: string
  afterAlt?: string
}

export function BeforeAfterSlider({
  before,
  after,
  beforeAlt = 'Antes',
  afterAlt = 'Depois',
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    let position = (x / rect.width) * 100
    if (position < 0) position = 0
    if (position > 100) position = 100
    setSliderPosition(position)
  }, [])

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    handleMove(e.clientX)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    handleMove(e.clientX)
  }

  const handlePointerUp = () => {
    setIsDragging(false)
  }

  // Cálculo proporcional para o fade gradual do "Antes" (soma totalmente entre 0% e 25%)
  const beforeOpacity = Math.max(0, Math.min(1, sliderPosition / 25))

  // Cálculo proporcional para o fade gradual do "Depois" (soma totalmente entre 75% e 100%)
  const afterOpacity = Math.max(0, Math.min(1, (100 - sliderPosition) / 25))

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden select-none rounded-2xl touch-none"
      style={{ aspectRatio: '16/11' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* Imagem DEPOIS (Fundo completo) */}
      <img
        src={after}
        alt={afterAlt}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {/* Imagem ANTES (Revelada via clip-path) */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={before}
          alt={beforeAlt}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      </div>

      {/* Badge ANTES (Fade progressivo contínuo ao se aproximar da borda esquerda) */}
      <div
        className="absolute top-4 left-4 z-10 px-4 py-1.5 text-xs font-semibold text-white rounded-full pointer-events-none transition-opacity duration-75 ease-out"
        style={{
          backgroundColor: 'rgba(45, 45, 51, 0.65)',
          backdropFilter: 'blur(4px)',
          opacity: beforeOpacity,
        }}
      >
        Antes
      </div>

      {/* Badge DEPOIS (Fade progressivo contínuo ao se aproximar da borda direita) */}
      <div
        className="absolute top-4 right-4 z-10 px-4 py-1.5 text-xs font-semibold text-white rounded-full pointer-events-none transition-opacity duration-75 ease-out"
        style={{
          backgroundColor: 'rgba(45, 45, 51, 0.65)',
          backdropFilter: 'blur(4px)',
          opacity: afterOpacity,
        }}
      >
        Depois
      </div>

      {/* Linha Divisória */}
      <div
        className="absolute top-0 bottom-0 z-20 w-0.5 bg-white pointer-events-none"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      />

      {/* Handle / Bolinha Centralizada */}
      <div
        className="absolute top-1/2 z-30 flex items-center justify-center w-9 h-9 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg cursor-ew-resize"
        style={{ left: `${sliderPosition}%` }}
      >
        <svg
          className="w-4 h-4 text-slate-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M8 7l-5 5 5 5M16 7l5 5-5 5"
          />
        </svg>
      </div>
    </div>
  )
}