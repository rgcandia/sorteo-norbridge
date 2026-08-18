import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Dices } from 'lucide-react'
import LucesMarquee from './LucesMarquee'
import { useSound } from '../hooks/useSound'

interface SplashScreenProps {
  onIniciar: () => void
}

export default function SplashScreen({ onIniciar }: SplashScreenProps) {
  const { playChime, playOpen } = useSound()

  useEffect(() => {
    const t = setTimeout(() => playChime(), 400)
    return () => clearTimeout(t)
  }, [playChime])

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
      </motion.div>

      <LucesMarquee />
    </div>
  )
}
