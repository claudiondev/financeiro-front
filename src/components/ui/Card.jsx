export default function Card({ className = '', children, ...props }) {
  return (
    <div className={`card-base ${className}`} {...props}>
      {children}
    </div>
  )
}
