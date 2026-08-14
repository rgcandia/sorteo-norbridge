import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, RotateCcw } from 'lucide-react'
import ConfirmResetModal from './ConfirmResetModal'
import type { Resultado } from '../hooks/useLottery'

interface ResultsScreenProps {
  resultados: Resultado[]
  verificarClave: (clave: string) => boolean
  celebrar: boolean
  onNuevoSorteo: () => void
  onReiniciarTodo: () => void
  onVolver: () => void
}

export default function ResultsScreen({
  resultados,
  verificarClave,
  celebrar,
  onNuevoSorteo,
  onReiniciarTodo,
  onVolver,
}: ResultsScreenProps) {
  const [mostrarReset, setMostrarReset] = useState(false)

  // Celebración: si es el final del evento, mucho confetti; si es vista manual, un burst leve
  useEffect(() => {
    if (celebrar) {
      const duracion = 4000
      const fin = Date.now() + duracion
      const lanzar = () => {
        confetti({ particleCount: 100, spread: 120, origin: { x: 0.5, y: 0.35 }, colors: ['#C6A246', '#ffffff', '#e74c3c', '#f1c40f', '#2ecc71'] })
        confetti({ particleCount: 60, angle: 60, spread: 75, origin: { x: 0, y: 0.6 }, colors: ['#C6A246', '#f1c40f'] })
        confetti({ particleCount: 60, angle: 120, spread: 75, origin: { x: 1, y: 0.6 }, colors: ['#C6A246', '#f1c40f'] })
        if (Date.now() < fin) setTimeout(lanzar, 300)
      }
      lanzar()
    } else {
      confetti({ particleCount: 40, spread: 70, origin: { x: 0.5, y: 0.4 }, colors: ['#C6A246', '#f1c40f'] })
    }
  }, [celebrar])

  return (
    <div className="results">
      <motion.h1
        className="results-titulo"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Trophy className="results-trofeo" size={48} /> ¡GANADORES!
      </motion.h1>
      <p className="results-sub">Feliz Día del Maestro — Norbridge 2026</p>

      <motion.div
        className="results-tabla-wrap"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <table className="results-tabla">
          <thead>
            <tr>
              <th>#</th>
              <th>Premio</th>
              <th>Ganador</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((r, i) => (
              <motion.tr
                key={`${r.ganador}-${i}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
              >
                <td className="results-num">{i + 1}</td>
                <td className="results-premio">{r.premio}</td>
                <td className="results-ganador">{r.ganador}</td>
              </motion.tr>
            ))}
            {resultados.length === 0 && (
              <tr>
                <td colSpan={3} className="empty">Todavía no hay resultados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>

      <div className="results-acciones">
        <button className="btn btn-primary btn-grande" onClick={onNuevoSorteo}>
          Nuevo sorteo
        </button>
        <button className="btn btn-ghost" onClick={onVolver}>
          Volver al inicio
        </button>
        <button className="btn btn-danger" onClick={() => setMostrarReset(true)}>
          <RotateCcw size={16} /> Reiniciar todo
        </button>
      </div>

      {/* Modal de confirmación con clave de admin */}
      <AnimatePresence>
        {mostrarReset && (
          <ConfirmResetModal
            verificarClave={verificarClave}
            onConfirmar={onReiniciarTodo}
            onCancelar={() => setMostrarReset(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
