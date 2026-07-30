import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'
import api, { extrairMensagemErro } from '../../services/api'
import Card from '../../components/ui/Card'
import StatCard from '../../components/ui/StatCard'
import PageHeader from '../../components/ui/PageHeader'
import EmptyState from '../../components/ui/EmptyState'
import Badge from '../../components/ui/Badge'
import PageSkeleton from '../../components/ui/Skeleton'
import { rotuloCategoria, corHexCategoria } from '../../constants/categorias'

export default function Resumo() {
  const [resumo, setResumo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchResumo = async () => {
      try {
        /*
         * GET /gastos/resumo retorna um ResumoMensal com os campos:
         *   - totalSalario, totalGasto, saldo, mensagem
         *   - maiorGasto         → card "Maior Gasto"
         *   - categorias         → Map<String,BigDecimal> para o gráfico de pizza
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

    fetchResumo()
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

  /*
   * O backend serializa Map<String,BigDecimal> como JSON object: {"ALIMENTACAO": 500.0, ...}
   * (a chave é o nome da constante do enum CategoriaGasto). rotuloCategoria traduz
   * para o texto em português exibido no gráfico.
   */
  const chartData = resumo.categorias ? Object.entries(resumo.categorias).map(([categoria, value]) => ({
    categoria,
    name: rotuloCategoria(categoria),
    value: Number(value),
  })) : []

  return (
    <div className="space-y-6">
      <PageHeader title="Resumo Financeiro" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Saldo Disponível"
          value={`R$ ${saldoValor.toFixed(2)}`}
          valueClassName={saldoValor >= 0 ? 'text-positive' : 'text-negative'}
        />
        <StatCard label="Total Entradas" value={`R$ ${entradaValor.toFixed(2)}`} valueClassName="text-positive" />
        <StatCard label="Total Saídas" value={`R$ ${saidaValor.toFixed(2)}`} valueClassName="text-negative" />
        <StatCard
          label="Maior Gasto"
          value={`R$ ${Number(resumo.maiorGasto || 0).toFixed(2)}`}
          valueClassName="text-accent-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-1">
          <h2 className="label-uppercase text-text-secondary mb-4">Gastos por Categoria</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.categoria} fill={corHexCategoria(entry.categoria)} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="Nenhum gasto registrado" />
          )}
        </Card>

        <Card className="p-6 lg:col-span-2">
          <h2 className="label-uppercase text-text-secondary mb-4">Transações Recentes</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {resumo.transacoesRecentes && resumo.transacoesRecentes.length > 0 ? (
              resumo.transacoesRecentes.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 border border-border rounded">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge>{rotuloCategoria(tx.categoria)}</Badge>
                    </div>
                    <p className="text-text-secondary text-xs">{tx.descricao}</p>
                    <p className="text-text-secondary text-xs">{tx.data}</p>
                  </div>
                  <p className={`font-bold ${tx.tipo === 'entrada' ? 'text-positive' : 'text-negative'}`}>
                    {tx.tipo === 'entrada' ? '+' : '-'} R$ {Math.abs(Number(tx.valor)).toFixed(2)}
                  </p>
                </div>
              ))
            ) : (
              <EmptyState message="Nenhuma transação registrada" className="py-4" />
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
