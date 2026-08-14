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

  const resume = useCallback(() => {
    const ctx = getCtx()
    if (ctx && ctx.state === 'suspended') ctx.resume()
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

  // Rueda girando (ticks rápidos de tambor)
  const startReel = useCallback(() => {
    resume()
    stopReel()
    reelTimer.current = setInterval(() => {
      playTone(300 + Math.random() * 250, 0.04, 'square', 0.045)
    }, 55)
  }, [playTone, resume])

  // Click de traba mecánica al frenar
  const stopReel = useCallback(() => {
    if (reelTimer.current) {
      clearInterval(reelTimer.current)
      reelTimer.current = null
    }
    playTone(180, 0.08, 'square', 0.12)
    playTone(120, 0.12, 'square', 0.12, 0.06)
  }, [playTone])

  // Fanfarria triunfal de ganador
  const playWin = useCallback(() => {
    resume()
    ;[523, 659, 784, 1047, 1319, 1568].forEach((f, i) => {
      playTone(f, 0.4, 'sine', 0.12, i * 0.11)
    })
  }, [playTone, resume])

  return { resume, playChime, playOpen, startReel, stopReel, playWin }
}
