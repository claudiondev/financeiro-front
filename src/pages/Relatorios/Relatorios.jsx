import { useState, useEffect } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, Legend, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { Download } from 'lucide-react'
import api, { extrairMensagemErro } from '../../services/api'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import ProgressBar from '../../components/ui/ProgressBar'
import SaldoDisplay from '../../components/ui/SaldoDisplay'
import TooltipRecibo from '../../components/ui/TooltipRecibo'
import EmptyState from '../../components/ui/EmptyState'
import PageSkeleton from '../../components/ui/Skeleton'
import { rotuloCategoria, corHexCategoria } from '../../constants/categorias'
import { MESES } from '../../utils/data'

export default function Relatorios() {
  const [relatorio, setRelatorio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mesSelected, setMesSelected] = useState(new Date().getMonth() + 1)

  /*
   * Recarrega o relatório sempre que o mês selecionado mudar.
   * useEffect com dependência [mesSelected] garante que cada troca de mês
   * dispara uma nova requisição — sem isso, o filtro seria puramente decorativo.
   */
  useEffect(() => {
    fetchRelatorio()
  }, [mesSelected])

  const fetchRelatorio = async () => {
    setLoading(true)
    try {
      const ano = new Date().getFullYear()

      /*
       * Endpoint correto: /gastos/relatorio (não /gastos/categorias).
       *
       * /gastos/categorias retorna apenas Map<String,BigDecimal> — não tem
       * totalEntradas, totalSaidas nem a estrutura de categoria com média e percentual.
       *
       * /gastos/relatorio retorna RelatorioMensalDTO com:
       *   - categorias: List<CategoriaDTO> com nome (enum), valor, percentual, media
       *   - totalEntradas
       *   - totalSaidas
       */
      const response = await api.get(`/gastos/relatorio?mes=${mesSelected}&ano=${ano}`)
      setRelatorio(response.data)
      setError('')
    } catch (err) {
      setError(extrairMensagemErro(err, 'Erro ao carregar relatório'))
    } finally {
      setLoading(false)
    }
  }

  /*
   * Exporta os dados de categorias como arquivo CSV.
   *
   * Blob + createObjectURL cria uma URL temporária no browser (blob://...).
   * Criar um <a> programaticamente e chamar .click() simula o download —
   * a URL é revogada logo depois para liberar memória.
   */
  const handleExportCSV = () => {
    if (!relatorio?.categorias?.length) return

    const headers = ['Categoria', 'Total Gasto', 'Participação %', 'Média Mensal']
    const csvContent = [
      headers.join(','),
      ...relatorio.categorias.map(cat => [
        rotuloCategoria(cat.nome),
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
    return <PageSkeleton />
  }

  /*
   * Por que o erro é tratado AQUI e não em `if (!relatorio) return null`?
   *
   * Se o fetch falhar, `relatorio` fica null E `error` fica preenchido.
   * O padrão original tinha `if (!relatorio) return null` ANTES do bloco
   * de erro, então o componente retornava null e o usuário nunca via a mensagem.
   *
   * Solução: quando não há dados, renderizamos o cabeçalho da página com o
   * seletor de mês e a mensagem de erro — o usuário pode trocar o mês e
   * tentar novamente sem precisar recarregar a página.
   */
  if (!relatorio) {
    return (
      <div className="space-y-6">
        <PageHeader title="Relatórios">
          <Select
            label="Selecionar Mês"
            value={mesSelected}
            onChange={(e) => setMesSelected(Number(e.target.value))}
          >
            {MESES.map(mes => (
              <option key={mes.numero} value={mes.numero}>{mes.nome}</option>
            ))}
          </Select>
        </PageHeader>

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

  // Aqui chegamos somente quando relatorio !== null

  const chartDataPie = relatorio.categorias?.map(cat => ({
    categoria: cat.nome,
    name: rotuloCategoria(cat.nome),
    value: Number(cat.valor)
  })) || []

  const chartDataBar = [
    { mes: 'Entradas', valor: Number(relatorio.totalEntradas || 0) },
    { mes: 'Saídas', valor: Number(relatorio.totalSaidas || 0) }
  ]

  // Total gasto no mês — soma das categorias para calcular percentual local
  const totalGasto = relatorio.categorias?.reduce((acc, cat) => acc + Number(cat.valor), 0) || 0

  return (
    <div className="space-y-6">
      <PageHeader title="Relatórios">
        <Select
          label="Selecionar Mês"
          value={mesSelected}
          onChange={(e) => setMesSelected(Number(e.target.value))}
        >
          {MESES.map(mes => (
            <option key={mes.numero} value={mes.numero}>{mes.nome}</option>
          ))}
        </Select>
        <Button onClick={handleExportCSV}>
          <Download size={18} />
          Exportar CSV
        </Button>
      </PageHeader>

      {/* Mostrado apenas se ocorrer erro após já ter dados (raro, mas possível) */}
      {error && (
        <Card className="border-negative border-opacity-30 p-4 text-negative text-sm">
          {error}
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="label-uppercase text-text-secondary mb-4">Gastos por Categoria</h2>
          {chartDataPie.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartDataPie}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  isAnimationActive={false}
                >
                  {chartDataPie.map((entry) => (
                    <Cell key={entry.categoria} fill={corHexCategoria(entry.categoria)} />
                  ))}
                </Pie>
                <Tooltip content={<TooltipRecibo />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState message="Nenhum dado disponível" />
          )}
        </Card>

        <Card className="p-6">
          <h2 className="label-uppercase text-text-secondary mb-4">Entradas vs Saídas</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartDataBar}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="mes" stroke="#64748B" style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 12 }} />
              <YAxis stroke="#64748B" style={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: 12 }} />
              <Tooltip content={<TooltipRecibo />} />
              <Bar dataKey="valor" name="Total" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                <Cell fill="#16A34A" />
                <Cell fill="#DC2626" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-background">
              <th className="label-uppercase text-text-secondary text-left px-6 py-4">Categoria</th>
              <th className="label-uppercase text-text-secondary text-right px-6 py-4">Total Gasto</th>
              <th className="label-uppercase text-text-secondary text-right px-6 py-4">Participação %</th>
              <th className="label-uppercase text-text-secondary text-right px-6 py-4">Média Mensal</th>
            </tr>
          </thead>
          <tbody>
            {relatorio.categorias && relatorio.categorias.length > 0 ? (
              relatorio.categorias.map((categoria) => {
                /*
                 * Recalculamos o percentual no frontend para garantir que
                 * a barra de progresso reflita a proporção dentro dos dados
                 * já carregados, independente do valor vindo do backend.
                 */
                const percentual = totalGasto > 0 ? (Number(categoria.valor) / totalGasto) * 100 : 0
                return (
                  <tr key={categoria.nome} className="border-b border-border hover:bg-background transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 flex-shrink-0"
                          style={{ backgroundColor: corHexCategoria(categoria.nome) }}
                          aria-hidden="true"
                        />
                        <span className="text-sm text-text-primary">{rotuloCategoria(categoria.nome)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <SaldoDisplay valor={Number(categoria.valor)} className="text-text-primary font-medium" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ProgressBar value={percentual} className="w-20" />
                        <span className="text-text-primary font-medium text-sm font-mono tabular-nums">{percentual.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <SaldoDisplay valor={Number(categoria.media)} className="text-text-primary font-medium" />
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan="4">
                  <EmptyState message="Nenhum dado disponível para este período" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </Card>
    </div>
  )
}
