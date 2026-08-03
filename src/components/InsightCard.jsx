import { AlertTriangle, TrendingUp, Lightbulb } from 'lucide-react'
import Card from './ui/Card'
import Badge from './ui/Badge'
import { rotuloCategoria } from '../constants/categorias'

const SEVERIDADE_INFO = {
  CRITICO: { badge: 'danger', label: 'Crítico' },
  ATENCAO: { badge: 'warning', label: 'Atenção' },
  INFO: { badge: 'info', label: 'Dica' },
}

const ICONE_POR_TIPO = {
  ORCAMENTO_ESTOURADO: AlertTriangle,
  ORCAMENTO_ATENCAO: AlertTriangle,
  RITMO_ACIMA_DO_ORCAMENTO: TrendingUp,
  CATEGORIA_EM_ALTA: TrendingUp,
  DICA_EDUCACIONAL: Lightbulb,
}

export default function InsightCard({ insight }) {
  const severidade = SEVERIDADE_INFO[insight.severidade] || SEVERIDADE_INFO.INFO
  const Icone = ICONE_POR_TIPO[insight.tipo] || Lightbulb

  return (
    <Card className="p-5 flex gap-4">
      <Icone size={20} className="flex-shrink-0 mt-0.5 text-text-secondary" />
      <div className="space-y-1.5 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-text-primary">{insight.titulo}</h3>
          <Badge variant={severidade.badge}>{severidade.label}</Badge>
          {insight.categoria && (
            <span className="text-xs text-text-secondary">{rotuloCategoria(insight.categoria)}</span>
          )}
        </div>
        <p className="text-sm text-text-secondary">{insight.mensagem}</p>
      </div>
    </Card>
  )
}
