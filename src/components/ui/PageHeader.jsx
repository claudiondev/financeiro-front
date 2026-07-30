export default function PageHeader({ title, children }) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <h1 className="text-3xl font-black text-text-primary">{title}</h1>
      {children && <div className="flex items-end gap-3 flex-wrap">{children}</div>}
    </div>
  )
}
