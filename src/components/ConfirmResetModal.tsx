import { useState } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, X } from 'lucide-react'

interface ConfirmResetModalProps {
  verificarClave: (clave: string) => boolean
  onConfirmar: () => void
  onCancelar: () => void
}

export default function ConfirmResetModal({ verificarClave, onConfirmar, onCancelar }: ConfirmResetModalProps) {
  const [clave, setClave] = useState('')
  const [error, setError] = useState(false)

  function confirmar() {
    if (verificarClave(clave.trim())) {
      onConfirmar()
    } else {
      setError(true)
    }
  }

  return (
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
          onKeyDown={(e) => e.key === 'Enter' && confirmar()}
          autoFocus
        />
        {error && <p className="modal-confirmar-error">Clave incorrecta.</p>}
        <div className="modal-acciones">
          <button className="btn btn-ghost" onClick={onCancelar}>Cancelar</button>
          <button className="btn btn-danger" onClick={confirmar}>
            <RotateCcw size={16} /> Confirmar y borrar
          </button>
        </div>
        <button className="btn-x modal-cerrar" onClick={onCancelar}><X size={20} /></button>
      </motion.div>
    </motion.div>
  )
}
