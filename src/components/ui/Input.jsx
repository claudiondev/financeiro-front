export default function Input({ label, error, className = '', id, ...props }) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="label-uppercase text-text-secondary block mb-2">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-4 py-3 bg-surface border rounded-lg text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 transition-colors ${
          error ? 'border-negative focus:ring-negative' : 'border-border focus:border-primary focus:ring-primary-200'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-negative text-xs mt-1">{error}</p>}
    </div>
  )
}
