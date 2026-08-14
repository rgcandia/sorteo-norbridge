interface LucesChaseProps {
  cantidad?: number
}

export default function LucesChase({ cantidad = 14 }: LucesChaseProps) {
  const luces = Array.from({ length: cantidad }, (_, i) => i)
  return (
    <div className="luces-chase">
      {luces.map((i) => (
        <span key={i} className="luces-chase-luz" style={{ animationDelay: `${i * 0.08}s` }} />
      ))}
    </div>
  )
}
