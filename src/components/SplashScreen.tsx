import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dices } from 'lucide-react'
import LucesMarquee from './LucesMarquee'
import { useSound } from '../hooks/useSound'

interface SplashScreenProps {
  onIniciar: () => void
}

const MENSAJES = [
  `En el colegio, cada rol cuenta y cada esfuerzo deja huella.
Gracias por construir día a día el lugar donde crecen nuestras
futuras generaciones.`,
  `"Una escuela no la forman solo sus muros, sino las manos y los
corazones de quienes trabajan en ella a diario"`,
  `"Detrás del éxito de cada estudiante hay un equipo entero que
abrió puertas, solucionó problemas y cuidó cada detalle.
¡Feliz día a todo nuestro personal!"`,
  `"La educación es un trabajo en equipo: unos enseñan, otros cuidan,
otros gestionan, pero todos inspiramos."`,
]

const INTERVALO_MS = 10000

export default function SplashScreen({ onIniciar }: SplashScreenProps) {
  const { playChime, playOpen } = useSound()
  const [indice, setIndice] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => playChime(), 400)
    return () => clearTimeout(t)
  }, [playChime])

  useEffect(() => {
    const id = setInterval(() => {
      setIndice((i) => (i + 1) % MENSAJES.length)
    }, INTERVALO_MS)
    return () => clearInterval(id)
  }, [])

  function handleIniciar() {
    playOpen()
    onIniciar()
  }

  return (
    <div className="splash">
      <LucesMarquee />

      <motion.div
        className="splash-contenido"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      >
        <div className="splash-cabecera">
          <motion.p
            className="splash-sello"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            ✦ NORBRIDGE SCHOOL ✦
          </motion.p>

          <motion.h1
            className="splash-titulo"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.9 }}
          >
            Celebrando la
            <br />
            <span className="splash-titulo-dorado">EDUCACIÓN</span>
          </motion.h1>

          <motion.p
            className="splash-lema"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.9 }}
          >
            Gracias por enseñarnos a volar.
          </motion.p>
        </div>

        <div className="splash-poema-centro">
          <motion.div
            className="splash-poema"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.15, duration: 1 }}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={indice}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
              >
                {MENSAJES[indice]}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="splash-btn">
          <motion.button
            className="btn-jugar"
            onClick={handleIniciar}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.4, type: 'spring', stiffness: 200, damping: 12 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
          >
            <Dices size={22} /> ¡QUE EMPIECEN LOS JUEGOS!
          </motion.button>
        </div>
      </motion.div>

      <LucesMarquee />
    </div>
  )
}
