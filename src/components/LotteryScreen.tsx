import { useState, useCallback, useRef } from 'react'
import confetti from 'canvas-confetti'
import { motion, AnimatePresence } from 'framer-motion'
import BallMachine from './BallMachine'
import { useSound } from '../hooks/useSound'
import type { Ganador } from '../hooks/useLottery'

interface LotteryScreenProps {
  nombres: string[]
  premios: string[]
  ganadores: Ganador[]
  sortear: () => Ganador | null
  onVolver: () => void
}

type Estado = 'idle' | 'girando' | 'ganador'

export default function LotteryScreen({ nombres, premios, ganadores, sortear, onVolver }: LotteryScreenProps) {
  const [estado, setEstado] = useState<Estado>('idle')
  const [ganador, setGanador] = useState<Ganador | null>(null)
  const [mostrarHistorial, setMostrarHistorial] = useState(false)
  const { resume, startShuffle, stopShuffle, playWin } = useSound()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const dispararConfetti = useCallback(() => {
    const duracion = 3500
    const fin = Date.now() + duracion
    const lanzar = () => {
      confetti({
        particleCount: 90,
        spread: 100,
        origin: { x: 0.5, y: 0.4 },
        colors: ['#C6A246', '#032960', '#ffffff', '#e74c3c', '#f1c40f', '#2ecc71'],
      })
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.7 },
        colors: ['#C6A246', '#f1c40f'],
      })
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.7 },
        colors: ['#C6A246', '#f1c40f'],
      })
      if (Date.now() < fin) setTimeout(lanzar, 250)
    }
    lanzar()
  }, [])

  function girar() {
    if (estado !== 'idle') return
    if (nombres.length === 0) return

    resume()
    setEstado('girando')
    setGanador(null)
    startShuffle()

    timerRef.current = setTimeout(() => {
      const resultado = sortear()
      stopShuffle()
      if (resultado) {
        setGanador(resultado)
        setEstado('ganador')
        playWin()
        dispararConfetti()
      } else {
        setEstado('idle')
      }
    }, 3200)
  }

  function siguiente() {
    if (timerRef.current) clearTimeout(timerRef.current)
    setEstado('idle')
    setGanador(null)
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      document.documentElement.requestFullscreen()
    }
  }

  const hayPremios = premios.length > 0
  const girando = estado === 'girando'

  return (
    <div className="lottery">
      <div className="lottery-topbar">
        <button className="btn btn-ghost" onClick={onVolver}>← Configurar</button>
        <div className="lottery-titulo">
          <span className="lottery-brand">SORTEO NORBRIDGE</span>
          <span className="lottery-contador">{nombres.length} participantes · {premios.length} premios</span>
        </div>
        <div className="lottery-topbar-acciones">
          <button className="btn btn-ghost" onClick={() => setMostrarHistorial((v) => !v)}>
            Ganadores ({ganadores.length})
          </button>
          <button className="btn btn-ghost" onClick={toggleFullscreen}>⛶</button>
        </div>
      </div>

      <div className="lottery-cuerpo">
        <div className="bolillero-contenedor">
          <BallMachine girando={girando} cantPelotas={Math.min(90, Math.max(40, nombres.length))} />
        </div>

        <div className="lottery-centro">
          <AnimatePresence mode="wait">
            {estado === 'idle' && (
              <motion.button
                key="girar"
                className="btn-girar"
                onClick={girar}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                GIRAR
              </motion.button>
            )}

            {estado === 'girando' && (
              <motion.div key="girando" className="sorteando" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Sorteando...
              </motion.div>
            )}

            {estado === 'ganador' && ganador && (
              <motion.div
                key="ganador"
                className="ganador"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                <span className="ganador-label">¡Ganador!</span>
                <h2 className="ganador-nombre">{ganador.nombre}</h2>
                <span className="ganador-premio">{ganador.premio}</span>
                <button className="btn btn-primary btn-grande" onClick={siguiente} disabled={nombres.length === 0 || !hayPremios}>
                  {nombres.length === 0 ? 'Sin participantes restantes' : 'Siguiente premio'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {mostrarHistorial && (
        <div className="historial-overlay" onClick={() => setMostrarHistorial(false)}>
          <div className="historial" onClick={(e) => e.stopPropagation()}>
            <div className="historial-header">
              <h3>Ganadores ({ganadores.length})</h3>
              <button className="btn-x" onClick={() => setMostrarHistorial(false)}>×</button>
            </div>
            {ganadores.length === 0 ? (
              <p className="empty">Todavía no hay ganadores.</p>
            ) : (
              <ul className="historial-lista">
                {ganadores.map((g, i) => (
                  <li key={`${g.nombre}-${i}`}>
                    <span className="historial-nombre">{g.nombre}</span>
                    <span className="historial-premio">{g.premio}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
