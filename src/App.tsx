import { useState } from 'react'
import SplashScreen from './components/SplashScreen'
import SetupScreen from './components/SetupScreen'
import LotteryScreen from './components/LotteryScreen'
import ResultsScreen from './components/ResultsScreen'
import { useLottery } from './hooks/useLottery'

type Pantalla = 'splash' | 'setup' | 'lottery' | 'results'

export default function App() {
  const [pantalla, setPantalla] = useState<Pantalla>('splash')
  const [esFinal, setEsFinal] = useState(false)
  const {
    nombres,
    premios,
    resultados,
    premioActual,
    ordenPremios,
    claveAdmin,
    cargarNombres,
    cargarPremios,
    moverPremio,
    setOrden,
    sortearPremio,
    sortearGanador,
    reiniciar,
    setClaveAdmin,
    verificarClave,
    borrarTodo,
  } = useLottery()

  switch (pantalla) {
    case 'splash':
      return (
        <SplashScreen
          onIniciar={() => setPantalla(nombres.length > 0 && premios.length > 0 ? 'lottery' : 'setup')}
        />
      )

    case 'setup':
      return (
        <SetupScreen
          nombres={nombres}
          premios={premios}
          ordenPremios={ordenPremios}
          claveAdmin={claveAdmin}
          cargarNombres={cargarNombres}
          cargarPremios={cargarPremios}
          moverPremio={moverPremio}
          setOrden={setOrden}
          setClaveAdmin={setClaveAdmin}
          verificarClave={verificarClave}
          onReiniciarTodo={() => { borrarTodo(); setPantalla('setup') }}
          onComenzar={() => setPantalla('lottery')}
          onVolver={() => setPantalla('splash')}
        />
      )

    case 'lottery':
      return (
        <LotteryScreen
          nombres={nombres}
          premios={premios}
          premioActual={premioActual}
          resultados={resultados}
          sortearPremio={sortearPremio}
          sortearGanador={sortearGanador}
          onTerminar={(final) => { setEsFinal(final ?? false); setPantalla('results') }}
          onVolver={() => setPantalla('setup')}
        />
      )

    case 'results':
      return (
        <ResultsScreen
          resultados={resultados}
          verificarClave={verificarClave}
          celebrar={esFinal}
          puedeContinuar={nombres.length > 0 && premios.length > 0}
          onContinuar={() => setPantalla('lottery')}
          onNuevoSorteo={() => { reiniciar(); setPantalla('setup') }}
          onReiniciarTodo={() => { borrarTodo(); setPantalla('setup') }}
          onVolver={() => setPantalla('splash')}
        />
      )
  }
}
