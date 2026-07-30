export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-border rounded ${className}`} />
}

/** Esqueleto genérico de página: título + linha de cards — usado enquanto os dados carregam. */
export default function PageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-64" />
    </div>
  )
}
