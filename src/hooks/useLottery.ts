import { useState, useCallback, useEffect } from 'react'

export interface Resultado {
  premio: string
  ganador: string
  fecha: string
}

const K_NOMBRES = 'sorteo_nombres'
const K_PREMIOS = 'sorteo_premios'
const K_RESULTADOS = 'sorteo_resultados'
const K_ORDEN = 'sorteo_orden'
const K_CLAVE = 'sorteo_clave'

const CLAVE_DEFAULT = 'norbridge2026'

function leer<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function guardar(key: string, valor: unknown): void {
  localStorage.setItem(key, JSON.stringify(valor))
}

export type OrdenPremios = 'aleatorio' | 'manual'

export function useLottery() {
  const [nombres, setNombres] = useState<string[]>([])
  const [premios, setPremios] = useState<string[]>([])
  const [resultados, setResultados] = useState<Resultado[]>([])
  const [premioActual, setPremioActual] = useState<string | null>(null)
  const [ordenPremios, setOrdenPremios] = useState<OrdenPremios>('aleatorio')
  const [claveAdmin, setClaveAdminState] = useState<string>(CLAVE_DEFAULT)

  useEffect(() => {
    setNombres(leer<string[]>(K_NOMBRES) ?? [])
    setPremios(leer<string[]>(K_PREMIOS) ?? [])
    setResultados(leer<Resultado[]>(K_RESULTADOS) ?? [])
    setOrdenPremios(leer<OrdenPremios>(K_ORDEN) ?? 'aleatorio')
    setClaveAdminState(leer<string>(K_CLAVE) ?? CLAVE_DEFAULT)
  }, [])

  const cargarNombres = useCallback((texto: string) => {
    const lista = texto
      .split(/[\n,;]+/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0)
    setNombres(lista)
    guardar(K_NOMBRES, lista)
    return lista.length
  }, [])

  const cargarPremios = useCallback((lista: string[]) => {
    const limpia = lista.map((p) => p.trim()).filter((p) => p.length > 0)
    setPremios(limpia)
    guardar(K_PREMIOS, limpia)
  }, [])

  const moverPremio = useCallback((idx: number, dir: -1 | 1) => {
    setPremios((prev) => {
      const j = idx + dir
      if (j < 0 || j >= prev.length) return prev
      const copia = [...prev]
      ;[copia[idx], copia[j]] = [copia[j], copia[idx]]
      guardar(K_PREMIOS, copia)
      return copia
    })
  }, [])

  const setOrden = useCallback((o: OrdenPremios) => {
    setOrdenPremios(o)
    guardar(K_ORDEN, o)
  }, [])

  // Saca un premio del pool y lo fija como premio actual
  const sortearPremio = useCallback((): string | null => {
    if (premios.length === 0) return null
    const idx = ordenPremios === 'manual' ? 0 : Math.floor(Math.random() * premios.length)
    const premio = premios[idx]
    const nuevosPremios = premios.filter((_, i) => i !== idx)
    setPremios(nuevosPremios)
    setPremioActual(premio)
    guardar(K_PREMIOS, nuevosPremios)
    return premio
  }, [premios, ordenPremios])

  // Saca un ganador del pool y lo combina con el premio actual
  const sortearGanador = useCallback((): Resultado | null => {
    if (!premioActual || nombres.length === 0) return null
    const idx = Math.floor(Math.random() * nombres.length)
    const ganador = nombres[idx]

    const nuevoResultado: Resultado = {
      premio: premioActual,
      ganador,
      fecha: new Date().toLocaleString('es-AR'),
    }

    const nuevosNombres = nombres.filter((_, i) => i !== idx)
    setNombres(nuevosNombres)
    setResultados((prev) => [...prev, nuevoResultado])
    setPremioActual(null)

    guardar(K_NOMBRES, nuevosNombres)
    guardar(K_RESULTADOS, [nuevoResultado, ...resultados])
    return nuevoResultado
  }, [premioActual, nombres, resultados])

  const reiniciar = useCallback(() => {
    setResultados([])
    setPremioActual(null)
    guardar(K_RESULTADOS, [])
  }, [])

  const setClaveAdmin = useCallback((clave: string) => {
    setClaveAdminState(clave)
    guardar(K_CLAVE, clave)
  }, [])

  const verificarClave = useCallback((clave: string) => clave === claveAdmin, [claveAdmin])

  const borrarTodo = useCallback(() => {
    setNombres([])
    setPremios([])
    setResultados([])
    setPremioActual(null)
    localStorage.removeItem(K_NOMBRES)
    localStorage.removeItem(K_PREMIOS)
    localStorage.removeItem(K_RESULTADOS)
  }, [])

  return {
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
  }
}
