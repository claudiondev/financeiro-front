const VARIANTS = {
  primary: 'bg-primary text-white hover:bg-primary-700 focus-visible:ring-primary-300',
  accent: 'bg-accent text-white hover:bg-accent-700 focus-visible:ring-accent-300',
  outline: 'border border-border text-text-primary hover:bg-background focus-visible:ring-primary-200',
  ghost: 'text-text-secondary hover:text-text-primary hover:bg-background focus-visible:ring-primary-200',
  danger: 'bg-negative text-white hover:bg-red-700 focus-visible:ring-red-300',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-sm',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors focus:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
