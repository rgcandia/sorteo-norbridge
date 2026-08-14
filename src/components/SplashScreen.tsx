import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Dices } from 'lucide-react'
import { useSound } from '../hooks/useSound'

interface SplashScreenProps {
  onIniciar: () => void
}

function LucesMarquee() {
  const luces = Array.from({ length: 30 }, (_, i) => i)
  return (
    <div className="marquee">
      {luces.map((i) => (
        <span key={i} className="marquee-luz" style={{ animationDelay: `${(i % 10) * 0.15}s` }} />
      ))}
    </div>
  )
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
          ✦ COLEGIO NORBRIDGE ✦
        </motion.p>

        <motion.h1
          className="splash-titulo"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.9 }}
        >
          ¡FELIZ DÍA
          <br />
          <span className="splash-titulo-dorado">MAESTROS!</span>
        </motion.h1>

        <motion.p
          className="splash-lema"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.9 }}
        >
          Gracias por enseñarnos a volar.
        </motion.p>

        <motion.blockquote
          className="splash-poema"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
        >
          “Enseñarás a volar, pero no volarán tu vuelo.
          Enseñarás a soñar, pero no soñarán tu sueño.
          Enseñarás a vivir, pero no vivirán tu vida.
          Sin embargo, en cada vuelo, en cada sueño y en cada vida,
          perdurará siempre la huella del camino enseñado.”
        </motion.blockquote>

        <motion.button
          className="btn-jugar"
          onClick={handleIniciar}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.1, type: 'spring', stiffness: 200, damping: 12 }}
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
