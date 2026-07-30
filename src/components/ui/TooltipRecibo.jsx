/**
 * Tooltip dos gráficos (Recharts) no estilo recibo: borda tracejada, como a
 * beirada picotada de um ticket. `content` customizado em vez do tooltip
 * padrão do Recharts — mesma referência visual da borda picotada da faixa
 * de saldo, aplicada em miniatura.
 */
export default function TooltipRecibo({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="bg-surface border border-dashed border-border rounded px-4 py-3 shadow-lg">
      {label && <p className="text-xs font-semibold text-text-primary mb-2">{label}</p>}
      <div className="space-y-1">
        {payload.map((item) => (
          <div key={item.dataKey} className="flex items-center justify-between gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-text-secondary">
              <span className="w-2 h-2 flex-shrink-0" style={{ backgroundColor: item.color }} aria-hidden="true" />
              {item.name}
            </span>
            <span className="font-mono tabular-nums font-medium text-text-primary">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(item.value))}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
