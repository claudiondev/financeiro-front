const VARIANTS = {
  neutral: 'bg-primary-50 text-primary-700 border-l-4 border-primary-300',
  accent: 'bg-accent-50 text-accent-700 border-l-4 border-accent',
  info: 'bg-blue-50 text-blue-700 border-l-4 border-badge-blue',
  warning: 'bg-orange-50 text-warning border-l-4 border-warning',
  danger: 'bg-red-50 text-negative border-l-4 border-negative',
}

export default function Badge({ variant = 'neutral', className = '', children }) {
  return (
    <span className={`inline-block px-3 py-1 rounded text-xs font-semibold whitespace-nowrap ${VARIANTS[variant]} ${className}`}>
      {children}
    </span>
  )
}
