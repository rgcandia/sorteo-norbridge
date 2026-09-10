import { useMemo } from 'react'

interface DestellosProps {
  cantidad?: number
}

export default function Destellos({ cantidad = 24 }: DestellosProps) {
  const puntos = useMemo(() => {
    return Array.from({ length: cantidad }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 3,
      size: 2 + Math.random() * 4,
    }))
  }, [cantidad])

  return (
    <div className="destellos">
      {puntos.map((p) => (
        <span
          key={p.id}
          className="destello"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
