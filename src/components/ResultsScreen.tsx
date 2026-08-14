import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, RotateCcw, X } from 'lucide-react'
import type { Resultado } from '../hooks/useLottery'

interface ResultsScreenProps {
  resultados: Resultado[]
  verificarClave: (clave: string) => boolean
  onNuevoSorteo: () => void
  onReiniciarTodo: () => void
  onVolver: () => void
}

export default function ResultsScreen({
  resultados,
  verificarClave,
  onNuevoSorteo,
  onReiniciarTodo,
  onVolver,
}: ResultsScreenProps) {
  const [mostrarReset, setMostrarReset] = useState(false)
  const [clave, setClave] = useState('')
  const [error, setError] = useState(false)

  function confirmarReset() {
    if (verificarClave(clave.trim())) {
      onReiniciarTodo()
    } else {
      setError(true)
    }
  }

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
        <button className="btn btn-danger" onClick={() => { setMostrarReset(true); setClave(''); setError(false); }}>
          <RotateCcw size={16} /> Reiniciar todo
        </button>
      </div>

      {/* Modal de confirmación con clave de admin */}
      <AnimatePresence>
        {mostrarReset && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="modal-confirmar"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
            >
              <h3 className="modal-confirmar-titulo">Reiniciar sorteo</h3>
              <p className="modal-confirmar-texto">
                Se borrarán <strong>todos</strong> los participantes, premios y resultados.
                Esta acción no se puede deshacer.
              </p>
              <input
                type="password"
                className="modal-confirmar-input"
                placeholder="Clave de administrador"
                value={clave}
                onChange={(e) => { setClave(e.target.value); setError(false); }}
                onKeyDown={(e) => e.key === 'Enter' && confirmarReset()}
                autoFocus
              />
              {error && <p className="modal-confirmar-error">Clave incorrecta.</p>}
              <div className="modal-acciones">
                <button className="btn btn-ghost" onClick={() => setMostrarReset(false)}>
                  Cancelar
                </button>
                <button className="btn btn-danger" onClick={confirmarReset}>
                  <RotateCcw size={16} /> Confirmar y borrar
                </button>
              </div>
              <button className="btn-x modal-cerrar" onClick={() => setMostrarReset(false)}>
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
