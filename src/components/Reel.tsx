import { useEffect, useMemo, useRef, useState } from 'react'

interface ReelProps {
  items: string[]
  resultado: string | null
  girando: boolean
  label: string
  onFin: () => void
}

export default function Reel({ items, resultado, girando, label, onFin }: ReelProps) {
  const [indice, setIndice] = useState(0)
  const [frenando, setFrenando] = useState(false)
  const onFinRef = useRef(onFin)
  onFinRef.current = onFin

  // Lista de animación: siempre incluye el resultado (aunque ya no esté en items)
  const lista = useMemo(() => {
    if (resultado && !items.includes(resultado)) return [...items, resultado]
    return items
  }, [items, resultado])

  useEffect(() => {
    if (!girando) return

    setFrenando(false)
    let i = Math.floor(Math.random() * lista.length)
    let delay = 40
    let elapsed = 0
    let timer: ReturnType<typeof setTimeout>

    const tick = () => {
      setIndice(i % lista.length)
      i += 1
      elapsed += delay
      delay *= 1.09

      // Cerca del final, marcar que está frenando (para quitar el blur)
      if (delay > 140) setFrenando(true)

      if (elapsed > 2400 || delay > 380) {
        const finalIdx = lista.indexOf(resultado ?? '')
        setIndice(finalIdx >= 0 ? finalIdx : 0)
        setFrenando(false)
        onFinRef.current()
        return
      }
      timer = setTimeout(tick, delay)
    }

    tick()
    return () => clearTimeout(timer)
  }, [girando, lista, resultado])

  const itemActual = lista[indice] ?? ''

  return (
    <div className="reel">
      <div className="reel-label">{label}</div>
      <div className="reel-marco">
        <div className="reel-ventana">
          <span className={`reel-item ${girando && !frenando ? 'reel-item--rapido' : ''}`}>
            {itemActual}
          </span>
        </div>
      </div>
    </div>
  )
}
