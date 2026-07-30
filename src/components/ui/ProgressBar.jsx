export default function ProgressBar({ value, max = 100, className = '', barClassName = 'bg-accent' }) {
  const percentual = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0

  return (
    <div className={`w-full h-2 bg-border overflow-hidden ${className}`}>
      <div className={`h-full transition-all ${barClassName}`} style={{ width: `${percentual}%` }} />
    </div>
  )
}
