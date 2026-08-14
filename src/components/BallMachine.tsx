import { useEffect, useRef } from 'react'
import Matter from 'matter-js'

interface BallMachineProps {
  girando: boolean
  cantPelotas?: number
}

const PALETA = ['#e74c3c', '#f39c12', '#f1c40f', '#2ecc71', '#1abc9c', '#3498db', '#9b59b6', '#e67e22', '#e84393', '#00cec9']

function crearParedes(cx: number, cy: number, radio: number, segmentos: number): Matter.Body[] {
  const paredes: Matter.Body[] = []
  const grosor = 30
  for (let i = 0; i < segmentos; i++) {
    const a0 = (i / segmentos) * Math.PI * 2
    const a1 = ((i + 1) / segmentos) * Math.PI * 2
    const am = (a0 + a1) / 2
    const x = cx + Math.cos(am) * radio
    const y = cy + Math.sin(am) * radio
    const largo = 2 * radio * Math.tan(Math.PI / segmentos) + 4
    const pared = Matter.Bodies.rectangle(x, y, largo, grosor, {
      isStatic: true,
      angle: am + Math.PI / 2,
      friction: 0.01,
      restitution: 0.6,
    })
    paredes.push(pared)
  }
  return paredes
}

export default function BallMachine({ girando, cantPelotas = 70 }: BallMachineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engineRef = useRef<Matter.Engine | null>(null)
  const pelotasRef = useRef<Matter.Body[]>([])
  const girandoRef = useRef(girando)
  girandoRef.current = girando

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)

    const cx = w / 2
    const cy = h / 2
    const radio = Math.min(w, h) * 0.42

    const engine = Matter.Engine.create({ gravity: { x: 0, y: 0.35 } })
    engineRef.current = engine

    const paredes = crearParedes(cx, cy, radio, 20)
    const radioPelota = Math.max(10, radio / 12)
    const pelotas: Matter.Body[] = []

    for (let i = 0; i < cantPelotas; i++) {
      const a = Math.random() * Math.PI * 2
      const r = Math.random() * (radio - radioPelota - 8)
      const color = PALETA[i % PALETA.length]
      const pelota = Matter.Bodies.circle(cx + Math.cos(a) * r, cy + Math.sin(a) * r, radioPelota, {
        restitution: 0.7,
        friction: 0.01,
        frictionAir: 0.02,
        density: 0.001,
        label: 'pelota',
      })
      ;(pelota as unknown as { color: string }).color = color
      pelotas.push(pelota)
    }

    Matter.Composite.add(engine.world, [...paredes, ...pelotas])
    pelotasRef.current = pelotas

    // Render loop manual (canvas propio para estilo profesional)
    let raf = 0
    const render = () => {
      if (girandoRef.current) {
        // Simular "aire" del bolillero: fuerzas aleatorias
        for (const p of pelotas) {
          Matter.Body.applyForce(p, p.position, {
            x: (Math.random() - 0.5) * 0.004 * p.mass,
            y: (Math.random() - 0.6) * 0.004 * p.mass,
          })
        }
      }
      Matter.Engine.update(engine, 1000 / 60)

      // Dibujar
      ctx.clearRect(0, 0, w, h)

      // Base/soporte
      ctx.save()
      const gradBase = ctx.createLinearGradient(0, cy + radio, 0, cy + radio + 40)
      gradBase.addColorStop(0, '#1a2a3a')
      gradBase.addColorStop(1, '#0a1128')
      ctx.fillStyle = gradBase
      ctx.beginPath()
      ctx.moveTo(cx - radio * 0.55, cy + radio * 0.85)
      ctx.lineTo(cx - radio * 0.75, cy + radio + 40)
      ctx.lineTo(cx + radio * 0.75, cy + radio + 40)
      ctx.lineTo(cx + radio * 0.55, cy + radio * 0.85)
      ctx.closePath()
      ctx.fill()
      ctx.restore()

      // Esfera de cristal (fondo interior)
      ctx.save()
      const gradEsfera = ctx.createRadialGradient(cx - radio * 0.3, cy - radio * 0.3, radio * 0.1, cx, cy, radio)
      gradEsfera.addColorStop(0, 'rgba(200, 225, 255, 0.12)')
      gradEsfera.addColorStop(0.7, 'rgba(150, 190, 240, 0.08)')
      gradEsfera.addColorStop(1, 'rgba(120, 160, 220, 0.15)')
      ctx.fillStyle = gradEsfera
      ctx.beginPath()
      ctx.arc(cx, cy, radio, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // Pelotas
      for (const p of pelotas) {
        const color = (p as unknown as { color: string }).color
        ctx.save()
        ctx.translate(p.position.x, p.position.y)
        ctx.rotate(p.angle)
        const g = ctx.createRadialGradient(-radioPelota * 0.3, -radioPelota * 0.3, radioPelota * 0.1, 0, 0, radioPelota)
        g.addColorStop(0, '#ffffff')
        g.addColorStop(0.25, color)
        g.addColorStop(1, '#00000044')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(0, 0, radioPelota, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // Borde de la esfera (cristal)
      ctx.save()
      ctx.strokeStyle = 'rgba(198, 162, 70, 0.7)'
      ctx.lineWidth = 6
      ctx.beginPath()
      ctx.arc(cx, cy, radio, 0, Math.PI * 2)
      ctx.stroke()

      // Brillo del cristal
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)'
      ctx.lineWidth = 12
      ctx.beginPath()
      ctx.arc(cx, cy, radio - 8, Math.PI * 0.9, Math.PI * 1.35)
      ctx.stroke()
      ctx.restore()

      raf = requestAnimationFrame(render)
    }
    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      Matter.World.clear(engine.world, false)
      Matter.Engine.clear(engine)
      engineRef.current = null
    }
  }, [cantPelotas])

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
}
