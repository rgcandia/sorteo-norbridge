import { useState } from 'react'
import { NOMBRES_SEED, PREMIOS_SEED } from '../data/seed'
import type { OrdenPremios } from '../hooks/useLottery'

interface SetupScreenProps {
  nombres: string[]
  premios: string[]
  ordenPremios: OrdenPremios
  cargarNombres: (texto: string) => number
  cargarPremios: (lista: string[]) => void
  moverPremio: (idx: number, dir: -1 | 1) => void
  setOrden: (o: OrdenPremios) => void
  onComenzar: () => void
  onVolver: () => void
}

export default function SetupScreen({
  nombres,
  premios,
  ordenPremios,
  cargarNombres,
  cargarPremios,
  moverPremio,
  setOrden,
  onComenzar,
  onVolver,
}: SetupScreenProps) {
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
        <button className="btn btn-ghost setup-volver" onClick={onVolver}>← Volver a la portada</button>
        <h1>🎰 Configurar sorteo</h1>
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

          <div className="orden-toggle">
            <span className="orden-toggle-label">Orden de sorteo:</span>
            <div className="orden-botones">
              <button
                className={`btn ${ordenPremios === 'aleatorio' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setOrden('aleatorio')}
              >
                🎲 Aleatorio
              </button>
              <button
                className={`btn ${ordenPremios === 'manual' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setOrden('manual')}
              >
                📋 Manual (en orden)
              </button>
            </div>
            {ordenPremios === 'manual' && (
              <p className="orden-hint">Se sortean en el orden de la lista. Reordená con las flechas ↑↓.</p>
            )}
          </div>

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
                <span className="premio-acciones">
                  {ordenPremios === 'manual' && (
                    <>
                      <button className="btn-flecha" onClick={() => moverPremio(i, -1)} disabled={i === 0}>↑</button>
                      <button className="btn-flecha" onClick={() => moverPremio(i, 1)} disabled={i === premios.length - 1}>↓</button>
                    </>
                  )}
                  <button className="btn-x" onClick={() => quitarPremio(i)} title="Quitar">×</button>
                </span>
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
          disabled={nombres.length === 0 || premios.length === 0}
        >
          {nombres.length === 0 || premios.length === 0
            ? 'Cargá participantes y premios primero'
            : `🎰 Empezar sorteo (${nombres.length} participantes, ${premios.length} premios)`}
        </button>
      </footer>
    </div>
  )
}
