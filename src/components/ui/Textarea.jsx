export default function Textarea({ label, className = '', id, ...props }) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="label-uppercase text-text-secondary block mb-2">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary-200 transition-colors resize-none ${className}`}
        {...props}
      />
    </div>
  )
}
