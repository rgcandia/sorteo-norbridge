interface LucesMarqueeProps {
  cantidad?: number
}

export default function LucesMarquee({ cantidad = 30 }: LucesMarqueeProps) {
  const luces = Array.from({ length: cantidad }, (_, i) => i)
  return (
    <div className="marquee">
      {luces.map((i) => (
        <span key={i} className="marquee-luz" style={{ animationDelay: `${(i % 10) * 0.15}s` }} />
      ))}
    </div>
  )
}
