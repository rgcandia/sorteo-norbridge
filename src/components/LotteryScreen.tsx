import { useState, useCallback } from 'react'
import confetti from 'canvas-confetti'
import { motion, AnimatePresence } from 'framer-motion'
import { Gift, Trophy, ListChecks, X, Maximize, Settings } from 'lucide-react'
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
  const [ganadorActual, setGanadorActual] = useState<Resultado | null>(null)
  const [mostrarResultados, setMostrarResultados] = useState(false)
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
    setGanadorActual(res)
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

  function cerrarGanador() {
    setGanadorActual(null)
    setResultadoPremio(null)
    setResultadoNombre(null)
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen()
    else document.documentElement.requestFullscreen()
  }

  const sinPremios = premios.length === 0 && !premioActual
  const mostrarModal = ganadorActual !== null && !girandoNombre

  return (
    <div className="lottery">
      <div className="lottery-topbar">
        <button className="btn btn-ghost" onClick={onVolver} title="Configurar">
          <Settings size={18} />
        </button>
        <div className="lottery-titulo">
          <span className="lottery-brand">SORTEO · DÍA DEL MAESTRO</span>
          <span className="lottery-contador">
            {nombres.length} participantes · {premios.length + (premioActual ? 1 : 0)} premios por sortear
          </span>
        </div>
        <div className="lottery-topbar-acciones">
          <button className="btn btn-ghost" onClick={() => setMostrarResultados(true)} title="Ver resultados">
            <ListChecks size={18} />
            <span className="topbar-badge">{resultados.length}</span>
          </button>
          <button className="btn btn-ghost" onClick={toggleFullscreen} title="Pantalla completa">
            <Maximize size={18} />
          </button>
          {sinPremios && (
            <button className="btn btn-primary" onClick={onTerminar}>
              <Trophy size={16} /> Resultados
            </button>
          )}
        </div>
      </div>

      <div className="lottery-cuerpo">
        <div className="reels">
          <Reel
            items={premios}
            resultado={resultadoPremio}
            girando={girandoPremio}
            label="Premio"
            onFin={finPremio}
          />
          <Reel
            items={nombres}
            resultado={resultadoNombre}
            girando={girandoNombre}
            label="Ganador"
            onFin={finNombre}
          />
        </div>

        <div className="lottery-controles">
          {!premioActual && !mostrarModal && (
            <button
              className="btn btn-primary btn-grande"
              onClick={girarPremio}
              disabled={girandoPremio || girandoNombre || premios.length === 0}
            >
              <Gift size={20} /> {girandoPremio ? 'Sorteando premio...' : 'Sortear premio'}
            </button>
          )}

          {premioActual && !mostrarModal && (
            <motion.div className="premio-fijado" initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
              <span className="premio-fijado-label">Premio sorteado</span>
              <span className="premio-fijado-valor">{premioActual}</span>
              <button
                className="btn btn-primary btn-grande"
                onClick={girarNombre}
                disabled={girandoNombre || girandoPremio || nombres.length === 0}
              >
                <Trophy size={20} /> {girandoNombre ? 'Sorteando ganador...' : 'Sortear ganador'}
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modal del ganador */}
      <AnimatePresence>
        {mostrarModal && ganadorActual && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-ganador"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 16 }}
            >
              <Trophy className="modal-ganador-trofeo" size={64} />
              <span className="ganador-label">¡Ganador!</span>
              <span className="modal-premio">{ganadorActual.premio}</span>
              <h2 className="ganador-nombre">{ganadorActual.ganador}</h2>
              <div className="modal-acciones">
                {premios.length > 0 && (
                  <button className="btn btn-primary btn-grande" onClick={cerrarGanador}>
                    Siguiente premio
                  </button>
                )}
                <button className="btn btn-ghost btn-grande" onClick={onTerminar}>
                  Ver resultados
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Panel de resultados */}
      <AnimatePresence>
        {mostrarResultados && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMostrarResultados(false)}
          >
            <motion.div
              className="panel-resultados"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="panel-resultados-header">
                <h3>Resultados ({resultados.length})</h3>
                <button className="btn-x" onClick={() => setMostrarResultados(false)}><X size={20} /></button>
              </div>
              {resultados.length === 0 ? (
                <p className="empty">Todavía no hay ganadores.</p>
              ) : (
                <ul className="panel-lista">
                  {resultados.map((r, i) => (
                    <li key={`${r.ganador}-${i}`}>
                      <span className="panel-num">{i + 1}</span>
                      <span className="panel-ganador">{r.ganador}</span>
                      <span className="panel-premio">{r.premio}</span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
