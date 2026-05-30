import { useState, useEffect } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, Legend, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { Download } from 'lucide-react'
import api from '../../services/api'

export default function Relatorios() {
  const [relatorio, setRelatorio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mesSelected, setMesSelected] = useState(new Date().getMonth() + 1)

  useEffect(() => {
    fetchRelatorio()
  }, [mesSelected])

  const fetchRelatorio = async () => {
    try {
      const ano = new Date().getFullYear()
      const response = await api.get(`/gastos/categorias?mes=${mesSelected}&ano=${ano}`)
      setRelatorio(response.data)
      setError('')
    } catch (err) {
      setError('Erro ao carregar relatório')
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = () => {
    if (!relatorio) return

    const headers = ['Categoria', 'Total Gasto', 'Participação %', 'Média Mensal']
    const csvContent = [
      headers.join(','),
      ...relatorio.categorias.map(cat => [
        cat.nome,
        cat.valor.toFixed(2),
        cat.percentual.toFixed(2),
        cat.media.toFixed(2)
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio-financeiro-${mesSelected}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-text-secondary">Carregando...</p>
      </div>
    )
  }

  if (!relatorio) return null

  const chartDataPie = relatorio.categorias?.map(cat => ({
    name: cat.nome,
    value: Number(cat.valor)
  })) || []

  const chartDataBar = [
    { mes: 'Entradas', valor: Number(relatorio.totalEntradas || 0) },
    { mes: 'Saídas', valor: Number(relatorio.totalSaidas || 0) }
  ]

  const COLORS = ['#C084FC', '#F87171', '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4']

  const totalGasto = relatorio.categorias?.reduce((acc, cat) => acc + Number(cat.valor), 0) || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">Relatórios</h1>
        <div className="flex gap-4 items-end">
          <div>
            <label className="label-uppercase text-text-secondary block mb-2 text-xs">Selecionar Mês</label>
            <input
              type="number"
              min="1"
              max="12"
              value={mesSelected}
              onChange={(e) => setMesSelected(Number(e.target.value))}
              className="input-dark px-4 py-3 w-24"
            />
          </div>
          <button
            onClick={handleExportCSV}
            className="btn-outlined-lg inline-flex items-center gap-2"
          >
            <Download size={18} />
            Exportar CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="card-base border-negative border-opacity-30 p-4 text-negative text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-base p-6">
          <h2 className="label-uppercase text-text-secondary mb-4">Gastos por Categoria</h2>
          {chartDataPie.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartDataPie}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartDataPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-text-secondary text-center py-8">Nenhum dado disponível</p>
          )}
        </div>

        <div className="card-base p-6">
          <h2 className="label-uppercase text-text-secondary mb-4">Entradas vs Saídas</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartDataBar}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="mes" stroke="#737373" />
              <YAxis stroke="#737373" />
              <Tooltip
                contentStyle={{ backgroundColor: '#161616', border: '1px solid #262626' }}
                labelStyle={{ color: '#F5F5F5' }}
              />
              <Bar dataKey="valor" fill="#C084FC" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card-base overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-dark bg-surface">
              <th className="label-uppercase text-text-secondary text-left px-6 py-4">Categoria</th>
              <th className="label-uppercase text-text-secondary text-right px-6 py-4">Total Gasto</th>
              <th className="label-uppercase text-text-secondary text-right px-6 py-4">Participação %</th>
              <th className="label-uppercase text-text-secondary text-right px-6 py-4">Média Mensal</th>
            </tr>
          </thead>
          <tbody>
            {relatorio.categorias && relatorio.categorias.length > 0 ? (
              relatorio.categorias.map((categoria) => {
                const percentual = totalGasto > 0 ? (Number(categoria.valor) / totalGasto) * 100 : 0
                return (
                  <tr key={categoria.nome} className="border-b border-border-dark hover:bg-surface hover:bg-opacity-50">
                    <td className="px-6 py-4">
                      <span className="badge-category">{categoria.nome}</span>
                    </td>
                    <td className="px-6 py-4 text-right text-text-primary font-medium">
                      R$ {Number(categoria.valor).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-20 h-2 bg-border-dark rounded overflow-hidden">
                          <div
                            className="h-full bg-accent transition-all"
                            style={{ width: `${percentual}%` }}
                          />
                        </div>
                        <span className="text-text-primary font-medium text-sm">{percentual.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-text-primary font-medium">
                      R$ {Number(categoria.media).toFixed(2)}
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-text-secondary">
                  Nenhum dado disponível para este período
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
