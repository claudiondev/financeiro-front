import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import Modal from '../../components/Modal'
import api, { extrairMensagemErro } from '../../services/api'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'
import SaldoDisplay from '../../components/ui/SaldoDisplay'
import EmptyState from '../../components/ui/EmptyState'
import PageSkeleton from '../../components/ui/Skeleton'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { CATEGORIAS, rotuloCategoria } from '../../constants/categorias'

const STATUS_INFO = {
  DENTRO_DO_LIMITE: { label: 'Dentro do limite', badge: 'accent', barra: 'bg-accent' },
  ATENCAO: { label: 'Atenção', badge: 'warning', barra: 'bg-warning' },
  ESTOURADO: { label: 'Estourado', badge: 'danger', barra: 'bg-negative' },
}

const FORM_VAZIO = { categoria: '', limiteMensal: '' }

export default function Metas() {
  const [orcamentos, setOrcamentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState(FORM_VAZIO)
  // null = criando uma meta nova; objeto = editando uma meta existente (categoria fica travada)
  const [editando, setEditando] = useState(null)
  const [idParaDeletar, setIdParaDeletar] = useState(null)
  // Evita duplo submit (duplo clique ou duplo Enter) — desabilita o botão até a requisição terminar
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchOrcamentos()
  }, [])

  const fetchOrcamentos = async () => {
    setLoading(true)
    try {
      // Sem filtro de mês/ano: o backend assume o mês corrente por padrão
      const response = await api.get('/orcamentos')
      setOrcamentos(response.data)
      setError('')
    } catch (err) {
      setError(extrairMensagemErro(err, 'Erro ao carregar metas'))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      // POST /orcamentos é upsert por categoria — mesma chamada serve para criar e editar
      await api.post('/orcamentos', formData)
      fecharModal()
      await fetchOrcamentos()
    } catch (err) {
      setError(extrairMensagemErro(err, 'Erro ao salvar meta'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!idParaDeletar) return
    try {
      await api.delete(`/orcamentos/${idParaDeletar}`)
      setIdParaDeletar(null)
      await fetchOrcamentos()
    } catch (err) {
      setIdParaDeletar(null)
      setError(extrairMensagemErro(err, 'Erro ao deletar meta'))
    }
  }

  // Categorias que ainda não têm meta definida — evita duplicar orçamento pra mesma categoria
  const categoriasComMeta = new Set(orcamentos.map((o) => o.categoria))
  const categoriasDisponiveis = CATEGORIAS.filter((c) => !categoriasComMeta.has(c.valor))

  const abrirCriacao = () => {
    setEditando(null)
    setFormData(FORM_VAZIO)
    setIsModalOpen(true)
  }

  const abrirEdicao = (orcamento) => {
    setEditando(orcamento)
    setFormData({ categoria: orcamento.categoria, limiteMensal: orcamento.limiteMensal })
    setIsModalOpen(true)
  }

  const fecharModal = () => {
    setIsModalOpen(false)
    setEditando(null)
    setFormData(FORM_VAZIO)
  }

  if (loading) {
    return <PageSkeleton />
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Metas de Orçamento">
        <Button onClick={abrirCriacao} disabled={categoriasDisponiveis.length === 0}>
          <Plus size={18} />
          Nova Meta
        </Button>
      </PageHeader>

      {error && (
        <Card className="border-negative border-opacity-30 p-4 text-negative text-sm">
          {error}
        </Card>
      )}

      {orcamentos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orcamentos.map((orcamento) => {
            const status = STATUS_INFO[orcamento.status] || STATUS_INFO.DENTRO_DO_LIMITE
            return (
              <Card key={orcamento.id} className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="label-uppercase text-text-secondary mb-1">{rotuloCategoria(orcamento.categoria)}</p>
                    <Badge variant={status.badge}>{status.label}</Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => abrirEdicao(orcamento)}
                      className="text-text-secondary hover:text-primary hover:bg-primary-50 p-2 rounded transition-colors"
                      title="Editar"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setIdParaDeletar(orcamento.id)}
                      className="text-negative hover:bg-red-50 p-2 rounded transition-colors"
                      title="Remover"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <SaldoDisplay valor={Number(orcamento.valorConsumido)} className="text-2xl font-bold text-text-primary" />
                    <span className="text-text-secondary text-sm font-mono tabular-nums">
                      de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(orcamento.limiteMensal))}
                    </span>
                  </div>
                  <ProgressBar value={Number(orcamento.percentualConsumido)} barClassName={status.barra} />
                  <p className="text-text-secondary text-xs mt-2 font-mono tabular-nums">
                    {Number(orcamento.percentualConsumido).toFixed(1)}% do limite usado este mês
                  </p>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="p-8">
          <EmptyState message="Nenhuma meta definida ainda — crie uma para acompanhar seus gastos por categoria." />
        </Card>
      )}

      <ConfirmDialog
        isOpen={idParaDeletar !== null}
        message="Tem certeza que deseja remover esta meta? Esta ação não pode ser desfeita."
        onCancel={() => setIdParaDeletar(null)}
        onConfirm={handleDelete}
      />

      <Modal isOpen={isModalOpen} title={editando ? 'Editar Meta' : 'Nova Meta'} onClose={fecharModal}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Categoria"
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
            disabled={!!editando}
            required
          >
            <option value="" disabled>Selecione uma categoria</option>
            {(editando ? CATEGORIAS : categoriasDisponiveis).map((cat) => (
              <option key={cat.valor} value={cat.valor}>{cat.rotulo}</option>
            ))}
          </Select>

          <Input
            label="Limite Mensal"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0,00"
            value={formData.limiteMensal}
            onChange={(e) => setFormData({ ...formData, limiteMensal: e.target.value })}
            required
          />

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={fecharModal} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={submitting}>
              {submitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
