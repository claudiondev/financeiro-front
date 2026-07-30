export default function Select({ label, className = '', id, children, ...props }) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="label-uppercase text-text-secondary block mb-2">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary-200 transition-colors ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  )
}
