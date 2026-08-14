import { useState } from 'react'
import SetupScreen from './components/SetupScreen'
import LotteryScreen from './components/LotteryScreen'
import { useLottery } from './hooks/useLottery'

export default function App() {
  const [pantalla, setPantalla] = useState<'setup' | 'lottery'>('setup')
  const { nombres, premios, ganadores, cargarNombres, cargarPremios, sortear } = useLottery()

  if (pantalla === 'setup' || nombres.length === 0) {
    return (
      <SetupScreen
        nombres={nombres}
        premios={premios}
        cargarNombres={cargarNombres}
        cargarPremios={cargarPremios}
        onComenzar={() => setPantalla('lottery')}
      />
    )
  }

  return (
    <LotteryScreen
      nombres={nombres}
      premios={premios}
      ganadores={ganadores}
      sortear={sortear}
      onVolver={() => setPantalla('setup')}
    />
  )
}
