import { useState, useEffect } from 'react'
import api, { extrairMensagemErro } from '../../services/api'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import PageSkeleton from '../../components/ui/Skeleton'
import InsightCard from '../../components/InsightCard'

export default function Assistente() {
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await api.get('/assistente/insights')
        setInsights(response.data)
      } catch (err) {
        setError(extrairMensagemErro(err, 'Erro ao carregar o assistente'))
      } finally {
        setLoading(false)
      }
    }
    fetchInsights()
  }, [])

  if (loading) {
    return <PageSkeleton />
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Assistente Financeiro" />

      {error && (
        <Card className="border-negative border-opacity-30 p-4 text-negative text-sm">
          {error}
        </Card>
      )}

      {insights.length > 0 ? (
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <InsightCard key={index} insight={insight} />
          ))}
        </div>
      ) : (
        <Card className="p-8">
          <EmptyState message="Nada a destacar por enquanto — continue registrando seus gastos para receber insights personalizados." />
        </Card>
      )}
    </div>
  )
}
