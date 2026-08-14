import { motion } from 'framer-motion'
import type { Resultado } from '../hooks/useLottery'

interface ResultsScreenProps {
  resultados: Resultado[]
  onReiniciar: () => void
  onVolver: () => void
}

export default function ResultsScreen({ resultados, onReiniciar, onVolver }: ResultsScreenProps) {
  return (
    <div className="results">
      <motion.h1
        className="results-titulo"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🏆 ¡GANADORES!
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
        <button className="btn btn-primary btn-grande" onClick={onReiniciar}>
          Nuevo sorteo
        </button>
        <button className="btn btn-ghost" onClick={onVolver}>
          Volver al inicio
        </button>
      </div>
    </div>
  )
}
