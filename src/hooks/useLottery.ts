import { useState, useCallback, useEffect } from 'react'

export interface Ganador {
  nombre: string
  premio: string
  fecha: string
}

const K_NOMBRES = 'sorteo_nombres'
const K_PREMIOS = 'sorteo_premios'
const K_GANADORES = 'sorteo_ganadores'

function leerArray<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T[]) : []
  } catch {
    return []
  }
}

function guardarArray(key: string, valor: unknown[]): void {
  localStorage.setItem(key, JSON.stringify(valor))
}

export function useLottery() {
  const [nombres, setNombres] = useState<string[]>([])
  const [premios, setPremios] = useState<string[]>([])
  const [ganadores, setGanadores] = useState<Ganador[]>([])

  // Carga inicial desde localStorage
  useEffect(() => {
    setNombres(leerArray<string>(K_NOMBRES))
    setPremios(leerArray<string>(K_PREMIOS))
    setGanadores(leerArray<Ganador>(K_GANADORES))
  }, [])

  const cargarNombres = useCallback((texto: string) => {
    const lista = texto
      .split(/[\n,;]+/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0)
    setNombres(lista)
    guardarArray(K_NOMBRES, lista)
    return lista.length
  }, [])

  const cargarPremios = useCallback((lista: string[]) => {
    const limpia = lista.map((p) => p.trim()).filter((p) => p.length > 0)
    setPremios(limpia)
    guardarArray(K_PREMIOS, limpia)
  }, [])

  const sortear = useCallback((): Ganador | null => {
    if (nombres.length === 0) return null

    const idxNombre = Math.floor(Math.random() * nombres.length)
    const nombre = nombres[idxNombre]

    let premio = 'Premio sorpresa'
    if (premios.length > 0) {
      const idxPremio = Math.floor(Math.random() * premios.length)
      premio = premios[idxPremio]
    }

    const nuevoGanador: Ganador = {
      nombre,
      premio,
      fecha: new Date().toLocaleString('es-AR'),
    }

    const nuevosNombres = nombres.filter((_, i) => i !== idxNombre)
    const nuevosPremios = premios.filter((p) => p !== premio)

    setNombres(nuevosNombres)
    setPremios(nuevosPremios)
    setGanadores((prev) => [nuevoGanador, ...prev])

    guardarArray(K_NOMBRES, nuevosNombres)
    guardarArray(K_PREMIOS, nuevosPremios)
    guardarArray(K_GANADORES, [nuevoGanador, ...ganadores])

    return nuevoGanador
  }, [nombres, premios, ganadores])

  const reiniciar = useCallback(() => {
    setGanadores([])
    guardarArray(K_GANADORES, [])
  }, [])

  const borrarTodo = useCallback(() => {
    setNombres([])
    setPremios([])
    setGanadores([])
    localStorage.removeItem(K_NOMBRES)
    localStorage.removeItem(K_PREMIOS)
    localStorage.removeItem(K_GANADORES)
  }, [])

  return {
    nombres,
    premios,
    ganadores,
    cargarNombres,
    cargarPremios,
    sortear,
    reiniciar,
    borrarTodo,
  }
}
