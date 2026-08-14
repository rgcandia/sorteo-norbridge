import { useRef, useCallback } from 'react'

let audioCtx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    audioCtx = new AC()
  }
  return audioCtx
}

export function useSound() {
  const reelTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const ruidoRef = useRef<AudioBuffer | null>(null)
  const whirRef = useRef<{ src: AudioBufferSourceNode; gain: GainNode } | null>(null)

  const resume = useCallback(() => {
    const ctx = getCtx()
    if (ctx && ctx.state === 'suspended') ctx.resume()
  }, [])

  // Buffer de ruido blanco (reutilizable)
  const getRuido = useCallback((ctx: AudioContext): AudioBuffer => {
    if (!ruidoRef.current) {
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 1, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
      ruidoRef.current = buffer
    }
    return ruidoRef.current
  }, [])

  const playTone = useCallback((freq: number, duration: number, type: OscillatorType = 'sine', vol = 0.15, delay = 0) => {
    const ctx = getCtx()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    const t = ctx.currentTime + delay
    gain.gain.setValueAtTime(vol, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + duration)
  }, [])

  // "Clack" mecánico (ruido blanco filtrado con decay rápido)
  const playClack = useCallback((freq = 500, vol = 0.25) => {
    const ctx = getCtx()
    if (!ctx) return
    const src = ctx.createBufferSource()
    src.buffer = getRuido(ctx)
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = freq
    filter.Q.value = 1.2
    const gain = ctx.createGain()
    const t = ctx.currentTime
    gain.gain.setValueAtTime(vol, t)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07)
    src.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    src.start(t)
    src.stop(t + 0.09)
  }, [getRuido])

  // "Whir" — zumbido continuo de la rueda girando
  const startWhir = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    const src = ctx.createBufferSource()
    src.buffer = getRuido(ctx)
    src.loop = true
    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 700
    filter.Q.value = 0.6
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.05, ctx.currentTime)
    src.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    src.start()
    whirRef.current = { src, gain }
  }, [getRuido])

  const stopWhir = useCallback(() => {
    const ctx = getCtx()
    if (!ctx) return
    const w = whirRef.current
    if (w) {
      const t = ctx.currentTime
      w.gain.gain.cancelScheduledValues(t)
      w.gain.gain.setValueAtTime(w.gain.gain.value, t)
      w.gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15)
      w.src.stop(t + 0.2)
      whirRef.current = null
    }
  }, [])

  // Chime suave de entrada (portada)
  const playChime = useCallback(() => {
    resume()
    ;[659, 784, 988, 1319].forEach((f, i) => playTone(f, 0.5, 'sine', 0.08, i * 0.12))
  }, [playTone, resume])

  // Fanfarria de apertura ("¡Que empiecen los juegos!")
  const playOpen = useCallback(() => {
    resume()
    ;[523, 659, 784, 1047].forEach((f, i) => playTone(f, 0.4, 'sawtooth', 0.08, i * 0.1))
    playTone(1568, 0.8, 'sine', 0.1, 0.45)
  }, [playTone, resume])

  // Frenar la rueda: stop whir + clack final grave y agudo
  const stopReel = useCallback(() => {
    if (reelTimer.current) {
      clearInterval(reelTimer.current)
      reelTimer.current = null
    }
    stopWhir()
    playClack(140, 0.3)
    playClack(600, 0.22)
    playClack(900, 0.15)
  }, [stopWhir, playClack])

  // Rueda girando: whir + clacks
  const startReel = useCallback(() => {
    resume()
    stopReel()
    startWhir()
    reelTimer.current = setInterval(() => {
      playClack(350 + Math.random() * 500)
    }, 60)
  }, [resume, stopReel, startWhir, playClack])

  // Fanfarria triunfal de ganador (monedas)
  const playWin = useCallback(() => {
    resume()
    ;[523, 659, 784, 1047, 1319, 1568].forEach((f, i) => {
      playTone(f, 0.4, 'sine', 0.12, i * 0.11)
    })
    // cascada de monedas (clacks agudos)
    for (let i = 0; i < 8; i++) {
      playClack(1500 + Math.random() * 1500, 0.12)
    }
  }, [playTone, playClack, resume])

  return { resume, playChime, playOpen, startReel, stopReel, playWin }
}
