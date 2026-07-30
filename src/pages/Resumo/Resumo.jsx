import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api, { extrairMensagemErro } from '../../services/api'
import Card from '../../components/ui/Card'
import LedgerBalance from '../../components/ui/LedgerBalance'
import SaldoDisplay from '../../components/ui/SaldoDisplay'
import PageHeader from '../../components/ui/PageHeader'
import EmptyState from '../../components/ui/EmptyState'
import PageSkeleton from '../../components/ui/Skeleton'
import { rotuloCategoria, corHexCategoria } from '../../constants/categorias'
import { formatarDataCurta } from '../../utils/data'
import texturaGuilhoche from '../../assets/textura-guilhoche.jpg'

function LinhaCategoria({ categoria, valor, percentual }) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <span
        className="w-2.5 h-2.5 flex-shrink-0"
        style={{ backgroundColor: corHexCategoria(categoria) }}
        aria-hidden="true"
      />
      <span className="text-sm text-text-primary font-medium flex-shrink-0 w-28 truncate">
        {rotuloCategoria(categoria)}
      </span>
      <span className="flex-1 h-1.5 bg-border overflow-hidden">
        <span
          className="block h-full transition-all"
          style={{ width: `${percentual}%`, backgroundColor: corHexCategoria(categoria) }}
        />
      </span>
      <SaldoDisplay valor={valor} className="text-sm text-text-primary font-medium w-24 text-right flex-shrink-0" />
      <span className="font-mono tabular-nums text-xs text-text-secondary w-12 text-right flex-shrink-0">
        {percentual.toFixed(0)}%
      </span>
    </div>
  )
}

export default function Resumo() {
  const [resumo, setResumo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [contasVencendo, setContasVencendo] = useState([])

  useEffect(() => {
    const fetchResumo = async () => {
      try {
        /*
         * GET /gastos/resumo retorna um ResumoMensal com os campos:
         *   - totalSalario, totalGasto, saldo, mensagem
         *   - maiorGasto         → tick na faixa de saldo
         *   - categorias         → Map<String,BigDecimal> para a régua de categorias
         *   - transacoesRecentes → List<TransacaoDTO> com os últimos 5 gastos
         */
        const response = await api.get('/gastos/resumo')
        setResumo(response.data)
      } catch (err) {
        setError(extrairMensagemErro(err, 'Erro ao carregar dados'))
      } finally {
        setLoading(false)
      }
    }

    // Aviso de contas fixas vencendo/atrasadas — busca à parte, não bloqueia o resumo
    // principal se falhar (é um complemento, não o dado central da página).
    const fetchContasVencendo = async () => {
      try {
        const response = await api.get('/gastos-fixos/pendentes-alerta')
        setContasVencendo(response.data)
      } catch {
        setContasVencendo([])
      }
    }

    fetchResumo()
    fetchContasVencendo()
  }, [])

  if (loading) {
    return <PageSkeleton />
  }

  if (error) {
    return (
      <Card className="border-negative border-opacity-30 p-6 text-negative">
        {error}
      </Card>
    )
  }

  if (!resumo) return null

  const saldoValor = Number(resumo.saldo || 0)
  const entradaValor = Number(resumo.totalSalario || 0)
  const saidaValor = Number(resumo.totalGasto || 0)
  const maiorGastoValor = Number(resumo.maiorGasto || 0)

  /*
   * O backend serializa Map<String,BigDecimal> como JSON object: {"ALIMENTACAO": 500.0, ...}
   * (a chave é o nome da constante do enum CategoriaGasto). Ordenado do maior pro menor
   * gasto — a régua de categorias lê como um extrato, do lançamento mais pesado pro mais leve.
   */
  const categorias = resumo.categorias
    ? Object.entries(resumo.categorias)
        .map(([categoria, value]) => ({ categoria, valor: Number(value) }))
        .sort((a, b) => b.valor - a.valor)
    : []

  return (
    <div className="space-y-6">
      <PageHeader title="Resumo Financeiro" />

      {contasVencendo.length > 0 && (
        <Link
          to="/contas-fixas"
          className="flex items-center gap-2 text-sm font-medium text-warning bg-orange-50 border border-warning border-opacity-30 rounded-lg px-4 py-3 hover:bg-orange-100 transition-colors"
        >
          <span aria-hidden="true">⚠</span>
          {contasVencendo.length === 1
            ? '1 conta fixa vencendo ou atrasada'
            : `${contasVencendo.length} contas fixas vencendo ou atrasadas`}
          <span className="ml-auto text-xs underline flex-shrink-0">Ver Contas Fixas →</span>
        </Link>
      )}

      <LedgerBalance
        saldo={saldoValor}
        entradas={entradaValor}
        saidas={saidaValor}
        maiorGasto={maiorGastoValor}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-1 relative overflow-hidden">
          {/* Textura de segurança (guilhoché) quase imperceptível — mesma referência visual do papel-moeda, nunca chamando mais atenção que o dado */}
          <div
            className="absolute inset-0 opacity-[0.09] pointer-events-none"
            style={{ backgroundImage: `url(${texturaGuilhoche})`, backgroundSize: '220px', backgroundRepeat: 'repeat' }}
            aria-hidden="true"
          />
          <div className="relative">
            <h2 className="label-uppercase text-text-secondary mb-1">Por categoria</h2>
            {categorias.length > 0 ? (
              <div className="divide-y divide-border">
                {categorias.map((item) => (
                  <LinhaCategoria
                    key={item.categoria}
                    categoria={item.categoria}
                    valor={item.valor}
                    percentual={saidaValor > 0 ? (item.valor / saidaValor) * 100 : 0}
                  />
                ))}
              </div>
            ) : (
              <EmptyState message="Nenhum gasto registrado" />
            )}
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h2 className="label-uppercase text-text-secondary mb-1">Extrato recente</h2>
          {resumo.transacoesRecentes && resumo.transacoesRecentes.length > 0 ? (
            <div className="divide-y divide-border max-h-96 overflow-y-auto">
              {resumo.transacoesRecentes.map((tx) => (
                <div key={tx.id} className="flex items-center gap-3 py-3">
                  <span
                    className="w-2.5 h-2.5 flex-shrink-0"
                    style={{ backgroundColor: corHexCategoria(tx.categoria) }}
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary font-medium truncate">{tx.descricao}</p>
                    <p className="text-xs text-text-secondary">
                      {rotuloCategoria(tx.categoria)} · <span className="font-mono">{formatarDataCurta(tx.data)}</span>
                    </p>
                  </div>
                  <SaldoDisplay
                    valor={-Math.abs(Number(tx.valor))}
                    className="text-sm font-semibold text-negative flex-shrink-0"
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState message="Nenhuma transação registrada" className="py-4" />
          )}
        </Card>
      </div>
    </div>
  )
}
