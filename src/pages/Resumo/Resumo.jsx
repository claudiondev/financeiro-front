import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts'
import api from '../../services/api'

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
         *   - categorias         → Map<String,Double> para o gráfico de pizza
         *   - transacoesRecentes → List<TransacaoDTO> com os últimos 5 gastos
         */
        const response = await api.get('/gastos/resumo')
        setResumo(response.data)
      } catch (err) {
        setError('Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }

    fetchResumo()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-text-secondary">Carregando...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card-base border-negative border-opacity-30 p-6 text-negative">
        {error}
      </div>
    )
  }

  if (!resumo) return null

  const saldoValor = Number(resumo.saldo || 0)
  const entradaValor = Number(resumo.totalSalario || 0)
  const saidaValor = Number(resumo.totalGasto || 0)

  /*
   * O backend serializa Map<String,Double> como JSON object: {"Alimentação": 500.0, ...}
   * Object.entries() converte para array de pares [chave, valor], que o Recharts
   * aceita via dataKey="value". Sem essa conversão, o gráfico não renderiza.
   */
  const chartData = resumo.categorias ? Object.entries(resumo.categorias).map(([name, value]) => ({
    name,
    value: Number(value)
  })) : []

  const COLORS = ['#C084FC', '#F87171', '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4']

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">Resumo Financeiro</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-base p-6 space-y-2">
          <p className="label-uppercase text-text-secondary">Saldo Disponível</p>
          <p className={`text-3xl font-bold ${saldoValor >= 0 ? 'text-positive' : 'text-negative'}`}>
            R$ {saldoValor.toFixed(2)}
          </p>
        </div>

        <div className="card-base p-6 space-y-2">
          <p className="label-uppercase text-text-secondary">Total Entradas</p>
          <p className="text-3xl font-bold text-positive">R$ {entradaValor.toFixed(2)}</p>
        </div>

        <div className="card-base p-6 space-y-2">
          <p className="label-uppercase text-text-secondary">Total Saídas</p>
          <p className="text-3xl font-bold text-negative">R$ {saidaValor.toFixed(2)}</p>
        </div>

        <div className="card-base p-6 space-y-2">
          <p className="label-uppercase text-text-secondary">Maior Gasto</p>
          <p className="text-3xl font-bold text-accent">
            R$ {Number(resumo.maiorGasto || 0).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-base p-6 lg:col-span-1">
          <h2 className="label-uppercase text-text-secondary mb-4">Gastos por Categoria</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-text-secondary text-center py-8">Nenhum gasto registrado</p>
          )}
        </div>

        <div className="card-base p-6 lg:col-span-2">
          <h2 className="label-uppercase text-text-secondary mb-4">Transações Recentes</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {/*
             * transacoesRecentes: campo adicionado ao ResumoMensal DTO.
             * Contém os últimos 5 gastos ordenados por data decrescente.
             * O campo "tipo" vem do TransacaoDTO: "entrada" ou "saida".
             */}
            {resumo.transacoesRecentes && resumo.transacoesRecentes.length > 0 ? (
              resumo.transacoesRecentes.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 border border-border-dark rounded">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="badge-category">{tx.categoria}</span>
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
              <p className="text-text-secondary text-center py-4">Nenhuma transação registrada</p>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
