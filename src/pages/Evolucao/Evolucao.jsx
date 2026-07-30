import { useState, useEffect } from 'react'
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import api, { extrairMensagemErro } from '../../services/api'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Select from '../../components/ui/Select'
import StatCard from '../../components/ui/StatCard'
import EmptyState from '../../components/ui/EmptyState'
import PageSkeleton from '../../components/ui/Skeleton'

const NOME_MES_ABREVIADO = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
]

export default function Evolucao() {
  const [evolucao, setEvolucao] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [meses, setMeses] = useState(6)

  useEffect(() => {
    fetchEvolucao()
  }, [meses])

  const fetchEvolucao = async () => {
    setLoading(true)
    try {
      const response = await api.get(`/gastos/evolucao?meses=${meses}`)
      setEvolucao(response.data)
      setError('')
    } catch (err) {
      setError(extrairMensagemErro(err, 'Erro ao carregar evolução mensal'))
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <PageSkeleton />
  }

  const seletorPeriodo = (
    <Select
      label="Período"
      value={meses}
      onChange={(e) => setMeses(Number(e.target.value))}
    >
      <option value={3}>Últimos 3 meses</option>
      <option value={6}>Últimos 6 meses</option>
      <option value={12}>Últimos 12 meses</option>
    </Select>
  )

  if (error || !evolucao?.length) {
    return (
      <div className="space-y-6">
        <PageHeader title="Evolução">{seletorPeriodo}</PageHeader>

        {error ? (
          <Card className="border-negative border-opacity-30 p-4 text-negative text-sm">
            {error}
          </Card>
        ) : (
          <Card className="p-8 text-center text-text-secondary">
            Nenhum dado disponível para este período
          </Card>
        )}
      </div>
    )
  }

  const chartData = evolucao.map((ponto) => ({
    label: `${NOME_MES_ABREVIADO[ponto.mes - 1]}/${String(ponto.ano).slice(2)}`,
    entradas: Number(ponto.totalEntradas),
    saidas: Number(ponto.totalSaidas),
    saldo: Number(ponto.saldo),
  }))

  // Totais do período — somam os pontos já carregados, não recalculam nada no backend
  const totalEntradas = chartData.reduce((acc, ponto) => acc + ponto.entradas, 0)
  const totalSaidas = chartData.reduce((acc, ponto) => acc + ponto.saidas, 0)
  const saldoPeriodo = totalEntradas - totalSaidas

  return (
    <div className="space-y-6">
      <PageHeader title="Evolução">{seletorPeriodo}</PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Entradas no período" value={`R$ ${totalEntradas.toFixed(2)}`} valueClassName="text-positive" />
        <StatCard label="Saídas no período" value={`R$ ${totalSaidas.toFixed(2)}`} valueClassName="text-negative" />
        <StatCard
          label="Saldo do período"
          value={`R$ ${saldoPeriodo.toFixed(2)}`}
          valueClassName={saldoPeriodo >= 0 ? 'text-positive' : 'text-negative'}
        />
      </div>

      <Card className="p-6">
        <h2 className="label-uppercase text-text-secondary mb-4">Entradas, Saídas e Saldo por Mês</h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData} margin={{ right: 24 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="label" stroke="#64748B" />
            <YAxis stroke="#64748B" />
            <Tooltip
              contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8 }}
              labelStyle={{ color: '#0F172A' }}
              formatter={(value) => `R$ ${Number(value).toFixed(2)}`}
            />
            <Legend />
            <Line type="monotone" dataKey="entradas" name="Entradas" stroke="#16A34A" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="saidas" name="Saídas" stroke="#DC2626" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="saldo" name="Saldo" stroke="#1E3F72" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
