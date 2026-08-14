import { useState, useCallback } from 'react'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'
import Reel from './Reel'
import { useSound } from '../hooks/useSound'
import type { Resultado } from '../hooks/useLottery'

interface LotteryScreenProps {
  nombres: string[]
  premios: string[]
  premioActual: string | null
  resultados: Resultado[]
  sortearPremio: () => string | null
  sortearGanador: () => Resultado | null
  onTerminar: () => void
  onVolver: () => void
}

export default function LotteryScreen({
  nombres,
  premios,
  premioActual,
  resultados,
  sortearPremio,
  sortearGanador,
  onTerminar,
  onVolver,
}: LotteryScreenProps) {
  const [girandoPremio, setGirandoPremio] = useState(false)
  const [girandoNombre, setGirandoNombre] = useState(false)
  const [resultadoPremio, setResultadoPremio] = useState<string | null>(null)
  const [resultadoNombre, setResultadoNombre] = useState<string | null>(null)
  const { resume, startReel, stopReel, playWin } = useSound()

  const dispararConfetti = useCallback(() => {
    const duracion = 3500
    const fin = Date.now() + duracion
    const lanzar = () => {
      confetti({ particleCount: 90, spread: 100, origin: { x: 0.5, y: 0.4 }, colors: ['#C6A246', '#ffffff', '#e74c3c', '#f1c40f', '#2ecc71'] })
      confetti({ particleCount: 55, angle: 60, spread: 70, origin: { x: 0, y: 0.7 }, colors: ['#C6A246', '#f1c40f'] })
      confetti({ particleCount: 55, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors: ['#C6A246', '#f1c40f'] })
      if (Date.now() < fin) setTimeout(lanzar, 250)
    }
    lanzar()
  }, [])

  function girarPremio() {
    if (girandoPremio || girandoNombre) return
    resume()
    const premio = sortearPremio()
    if (!premio) return
    setResultadoPremio(premio)
    setGirandoPremio(true)
    startReel()
  }

  function finPremio() {
    stopReel()
    setGirandoPremio(false)
  }

  function girarNombre() {
    if (girandoNombre || girandoPremio) return
    if (!premioActual) return
    resume()
    const res = sortearGanador()
    if (!res) return
    setResultadoNombre(res.ganador)
    setGirandoNombre(true)
    startReel()
  }

  function finNombre() {
    stopReel()
    setGirandoNombre(false)
    playWin()
    dispararConfetti()
  }

  const sinPremios = premios.length === 0 && !premioActual
  const hayGanador = resultadoNombre !== null && !girandoNombre

  return (
    <div className="lottery">
      <div className="lottery-topbar">
        <button className="btn btn-ghost" onClick={onVolver}>← Configurar</button>
        <div className="lottery-titulo">
          <span className="lottery-brand">SORTEO · DÍA DEL MAESTRO</span>
          <span className="lottery-contador">
            {nombres.length} participantes · {premios.length + (premioActual ? 1 : 0)} premios por sortear
          </span>
        </div>
        <div className="lottery-topbar-acciones">
          <span className="lottery-ganados">Ganados: {resultados.length}</span>
          {sinPremios && (
            <button className="btn btn-primary" onClick={onTerminar}>Ver resultados →</button>
          )}
        </div>
      </div>

      <div className="lottery-cuerpo">
        <div className="reels">
          <Reel
            items={premios}
            resultado={resultadoPremio}
            girando={girandoPremio}
            label="PREMIO"
            onFin={finPremio}
          />
          <Reel
            items={nombres}
            resultado={resultadoNombre}
            girando={girandoNombre}
            label="GANADOR"
            onFin={finNombre}
          />
        </div>

        <div className="lottery-controles">
          {!premioActual && !hayGanador && (
            <button className="btn btn-primary btn-grande" onClick={girarPremio} disabled={girandoPremio || girandoNombre || premios.length === 0}>
              {girandoPremio ? 'Sorteando premio...' : '🎁 SORTEAR PREMIO'}
            </button>
          )}

          {premioActual && !hayGanador && (
            <motion.div className="premio-fijado" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <span className="premio-fijado-label">Premio sorteado</span>
              <span className="premio-fijado-valor">🎁 {premioActual}</span>
              <button className="btn btn-primary btn-grande" onClick={girarNombre} disabled={girandoNombre || girandoPremio || nombres.length === 0}>
                {girandoNombre ? 'Sorteando ganador...' : '🎰 SORTEAR GANADOR'}
              </button>
            </motion.div>
          )}

          {hayGanador && (
            <motion.div className="ganador" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 180, damping: 14 }}>
              <span className="ganador-label">¡Ganador!</span>
              <span className="ganador-premio">🎁 {premioActual ?? resultadoPremio}</span>
              <h2 className="ganador-nombre">{resultadoNombre}</h2>
              <button className="btn btn-primary btn-grande" onClick={() => { setResultadoPremio(null); setResultadoNombre(null); }} disabled={girandoNombre || girandoPremio}>
                {premios.length === 0 ? 'Último sorteo' : 'Siguiente premio'}
              </button>
              {premios.length === 0 && (
                <button className="btn btn-ghost" onClick={onTerminar}>Ver resultados →</button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
