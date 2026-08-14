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
  const tickTimer = useRef<ReturnType<typeof setInterval> | null>(null)

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

  // Sonido de bolillas agitándose (click rápido repetido)
  const startShuffle = useCallback(() => {
    resume()
    tickTimer.current = setInterval(() => {
      playTone(500 + Math.random() * 600, 0.05, 'square', 0.05)
    }, 70)
  }, [playTone, resume])

  const stopShuffle = useCallback(() => {
    if (tickTimer.current) {
      clearInterval(tickTimer.current)
      tickTimer.current = null
    }
  }, [])

  // Fanfarria de ganador
  const playWin = useCallback(() => {
    resume()
    const ctx = getCtx()
    if (!ctx) return
    ;[523, 659, 784, 1047, 1319].forEach((f, i) => {
      playTone(f, 0.35, 'sine', 0.14, i * 0.12)
    })
  }, [playTone, resume])

  return { resume, startShuffle, stopShuffle, playWin, playTone }
}
