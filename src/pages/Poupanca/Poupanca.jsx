import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, PiggyBank } from 'lucide-react'
import Modal from '../../components/Modal'
import api, { extrairMensagemErro } from '../../services/api'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import ProgressBar from '../../components/ui/ProgressBar'
import SaldoDisplay from '../../components/ui/SaldoDisplay'
import EmptyState from '../../components/ui/EmptyState'
import PageSkeleton from '../../components/ui/Skeleton'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { formatarDataCompleta } from '../../utils/data'
import { useUsuario } from '../../context/UsuarioContext'

const STATUS_INFO = {
  EM_ANDAMENTO: { label: 'Em andamento', badge: 'info', barra: 'bg-primary' },
  CONCLUIDA: { label: 'Concluída', badge: 'accent', barra: 'bg-accent' },
  ATRASADA: { label: 'Atrasada', badge: 'danger', barra: 'bg-negative' },
}

const FORM_VAZIO = { nome: '', valorAlvo: '', prazo: '' }
const APORTE_VAZIO = { valor: '', data: new Date().toISOString().slice(0, 10) }

export default function Poupanca() {
  const { usuario } = useUsuario()
  const modoDemo = usuario?.demo
  const [metas, setMetas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState(FORM_VAZIO)
  const [editandoId, setEditandoId] = useState(null)
  const [idParaDeletar, setIdParaDeletar] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Aporte é um fluxo separado do de criar/editar meta — modal próprio, mais enxuto
  const [metaParaAporte, setMetaParaAporte] = useState(null)
  const [aporteForm, setAporteForm] = useState(APORTE_VAZIO)
  const [enviandoAporte, setEnviandoAporte] = useState(false)

  useEffect(() => {
    fetchMetas()
  }, [])

  const fetchMetas = async () => {
    setLoading(true)
    try {
      const response = await api.get('/metas-economia')
      setMetas(response.data)
      setError('')
    } catch (err) {
      setError(extrairMensagemErro(err, 'Erro ao carregar metas de economia'))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      const payload = { ...formData, prazo: formData.prazo || null }
      if (editandoId) {
        await api.put(`/metas-economia/${editandoId}`, payload)
      } else {
        await api.post('/metas-economia', payload)
      }
      fecharModal()
      await fetchMetas()
    } catch (err) {
      setError(extrairMensagemErro(err, 'Erro ao salvar meta'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!idParaDeletar) return
    try {
      await api.delete(`/metas-economia/${idParaDeletar}`)
      setIdParaDeletar(null)
      await fetchMetas()
    } catch (err) {
      setIdParaDeletar(null)
      setError(extrairMensagemErro(err, 'Erro ao deletar meta'))
    }
  }

  const handleRegistrarAporte = async (e) => {
    e.preventDefault()
    if (enviandoAporte || !metaParaAporte) return
    setEnviandoAporte(true)
    try {
      await api.post(`/metas-economia/${metaParaAporte.id}/aportes`, aporteForm)
      setMetaParaAporte(null)
      setAporteForm(APORTE_VAZIO)
      await fetchMetas()
    } catch (err) {
      setError(extrairMensagemErro(err, 'Erro ao registrar aporte'))
    } finally {
      setEnviandoAporte(false)
    }
  }

  const abrirCriacao = () => {
    setEditandoId(null)
    setFormData(FORM_VAZIO)
    setIsModalOpen(true)
  }

  const abrirEdicao = (meta) => {
    setEditandoId(meta.id)
    setFormData({ nome: meta.nome, valorAlvo: meta.valorAlvo, prazo: meta.prazo || '' })
    setIsModalOpen(true)
  }

  const fecharModal = () => {
    setIsModalOpen(false)
    setEditandoId(null)
    setFormData(FORM_VAZIO)
  }

  if (loading) {
    return <PageSkeleton />
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Poupança">
        <Button onClick={abrirCriacao} disabled={modoDemo} title={modoDemo ? 'Desabilitado no modo demo' : undefined}>
          <Plus size={18} />
          Nova Meta
        </Button>
      </PageHeader>

      {error && (
        <Card className="border-negative border-opacity-30 p-4 text-negative text-sm">
          {error}
        </Card>
      )}

      {metas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metas.map((meta) => {
            const status = STATUS_INFO[meta.status] || STATUS_INFO.EM_ANDAMENTO
            return (
              <Card key={meta.id} className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-text-primary text-sm font-medium mb-1 truncate">{meta.nome}</p>
                    <Badge variant={status.badge}>{status.label}</Badge>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => abrirEdicao(meta)}
                      disabled={modoDemo}
                      className="text-text-secondary hover:text-primary hover:bg-primary-50 p-2 rounded transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                      title={modoDemo ? 'Desabilitado no modo demo' : 'Editar'}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setIdParaDeletar(meta.id)}
                      disabled={modoDemo}
                      className="text-negative hover:bg-red-50 p-2 rounded transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                      title={modoDemo ? 'Desabilitado no modo demo' : 'Remover'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <SaldoDisplay valor={Number(meta.valorAcumulado)} className="text-2xl font-bold text-text-primary" />
                    <span className="text-text-secondary text-sm font-mono tabular-nums">
                      de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(meta.valorAlvo))}
                    </span>
                  </div>
                  <ProgressBar value={Number(meta.valorAcumulado)} max={Number(meta.valorAlvo)} barClassName={status.barra} />
                  <p className="text-text-secondary text-xs mt-2 font-mono tabular-nums">
                    {Number(meta.percentualConcluido).toFixed(1)}% concluído
                    {meta.prazo && <> · prazo {formatarDataCompleta(meta.prazo)}</>}
                  </p>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setMetaParaAporte(meta)}
                  disabled={modoDemo}
                  title={modoDemo ? 'Desabilitado no modo demo' : undefined}
                >
                  <PiggyBank size={16} />
                  Registrar aporte
                </Button>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="p-8">
          <EmptyState message="Nenhuma meta de economia ainda — crie uma pra começar a juntar dinheiro pra algo." />
        </Card>
      )}

      <ConfirmDialog
        isOpen={idParaDeletar !== null}
        message="Tem certeza que deseja remover esta meta? O histórico de aportes já feitos continua nos seus gastos, só a meta em si é removida."
        onCancel={() => setIdParaDeletar(null)}
        onConfirm={handleDelete}
      />

      <Modal isOpen={isModalOpen} title={editandoId ? 'Editar Meta' : 'Nova Meta de Economia'} onClose={fecharModal}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome"
            placeholder="Ex: Viagem para a praia"
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            required
          />

          <Input
            label="Valor Alvo"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0,00"
            value={formData.valorAlvo}
            onChange={(e) => setFormData({ ...formData, valorAlvo: e.target.value })}
            required
          />

          <div>
            <Input
              label="Prazo (opcional)"
              type="date"
              value={formData.prazo}
              onChange={(e) => setFormData({ ...formData, prazo: e.target.value })}
            />
            <p className="text-text-secondary text-xs mt-1">Deixe em branco se não tiver data definida.</p>
          </div>

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

      <Modal isOpen={metaParaAporte !== null} title={`Registrar aporte — ${metaParaAporte?.nome || ''}`} onClose={() => setMetaParaAporte(null)}>
        <form onSubmit={handleRegistrarAporte} className="space-y-4">
          <Input
            label="Valor"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0,00"
            value={aporteForm.valor}
            onChange={(e) => setAporteForm({ ...aporteForm, valor: e.target.value })}
            required
          />

          <Input
            label="Data"
            type="date"
            value={aporteForm.data}
            onChange={(e) => setAporteForm({ ...aporteForm, data: e.target.value })}
            required
          />

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setMetaParaAporte(null)} disabled={enviandoAporte}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={enviandoAporte}>
              {enviandoAporte ? 'Registrando...' : 'Registrar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
