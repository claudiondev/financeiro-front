export default function EmptyState({ message, className = '' }) {
  return (
    <p className={`text-text-secondary text-center py-8 ${className}`}>
      {message}
    </p>
  )
}
