import { useState } from 'react'
import { NOMBRES_SEED, PREMIOS_SEED } from '../data/seed'

interface SetupScreenProps {
  nombres: string[]
  premios: string[]
  cargarNombres: (texto: string) => number
  cargarPremios: (lista: string[]) => void
  onComenzar: () => void
}

export default function SetupScreen({ nombres, premios, cargarNombres, cargarPremios, onComenzar }: SetupScreenProps) {
  const [textoNombres, setTextoNombres] = useState(nombres.join('\n'))
  const [nuevoPremio, setNuevoPremio] = useState('')

  function handleCargarSeed() {
    const n = NOMBRES_SEED.join('\n')
    setTextoNombres(n)
    cargarNombres(n)
    cargarPremios([...PREMIOS_SEED])
  }

  function handleParsear() {
    cargarNombres(textoNombres)
  }

  function agregarPremio() {
    const p = nuevoPremio.trim()
    if (!p) return
    cargarPremios([...premios, p])
    setNuevoPremio('')
  }

  function quitarPremio(idx: number) {
    cargarPremios(premios.filter((_, i) => i !== idx))
  }

  return (
    <div className="setup">
      <header className="setup-header">
        <h1>Sorteo Norbridge</h1>
        <p className="setup-sub">Cargá los participantes y los premios, luego iniciá el sorteo.</p>
      </header>

      <div className="setup-grid">
        <section className="setup-card">
          <h2>Participantes ({nombres.length})</h2>
          <textarea
            value={textoNombres}
            onChange={(e) => setTextoNombres(e.target.value)}
            onBlur={handleParsear}
            placeholder="Pegá un nombre por línea, o separados por coma..."
            rows={14}
          />
          <div className="setup-actions">
            <button className="btn" onClick={handleParsear}>Cargar nombres</button>
            <button className="btn btn-ghost" onClick={handleCargarSeed}>Cargar 150 nombres de ejemplo</button>
          </div>
        </section>

        <section className="setup-card">
          <h2>Premios ({premios.length})</h2>
          <div className="premio-input">
            <input
              value={nuevoPremio}
              onChange={(e) => setNuevoPremio(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && agregarPremio()}
              placeholder="Escribí un premio y Enter..."
            />
            <button className="btn" onClick={agregarPremio}>Agregar</button>
          </div>
          <ul className="premios-lista">
            {premios.map((p, i) => (
              <li key={`${p}-${i}`}>
                <span>{i + 1}. {p}</span>
                <button className="btn-x" onClick={() => quitarPremio(i)} title="Quitar">×</button>
              </li>
            ))}
            {premios.length === 0 && <li className="empty">Sin premios. Agregalos o cargá los de ejemplo.</li>}
          </ul>
          {premios.length === 0 && (
            <button className="btn btn-ghost" onClick={() => cargarPremios([...PREMIOS_SEED])}>
              Cargar 20 premios de ejemplo
            </button>
          )}
        </section>
      </div>

      <footer className="setup-footer">
        <button
          className="btn btn-primary btn-grande"
          onClick={onComenzar}
          disabled={nombres.length === 0}
        >
          {nombres.length === 0 ? 'Cargá participantes primero' : `Empezar sorteo (${nombres.length} participantes)`}
        </button>
      </footer>
    </div>
  )
}
