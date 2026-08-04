import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, Pause, Play, CheckCircle2 } from 'lucide-react'
import Modal from '../../components/Modal'
import api, { extrairMensagemErro } from '../../services/api'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import Input from '../../components/ui/Input'
import Badge from '../../components/ui/Badge'
import SaldoDisplay from '../../components/ui/SaldoDisplay'
import EmptyState from '../../components/ui/EmptyState'
import PageSkeleton from '../../components/ui/Skeleton'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { CATEGORIAS, rotuloCategoria } from '../../constants/categorias'
import { formatarDataCompleta } from '../../utils/data'
import { useUsuario } from '../../context/UsuarioContext'

const STATUS_INFO = {
  PAGO: { label: 'Pago', badge: 'accent' },
  VENCENDO: { label: 'Vencendo', badge: 'warning' },
  ATRASADO: { label: 'Atrasado', badge: 'danger' },
  PENDENTE: { label: 'Pendente', badge: 'neutral' },
}

const FORM_VAZIO = { categoria: '', valor: '', descricao: '', diaVencimento: '', dataInicio: '', totalParcelas: '' }

export default function ContasFixas() {
  const { usuario } = useUsuario()
  const modoDemo = usuario?.demo
  const [contas, setContas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState(FORM_VAZIO)
  // null = criando uma conta nova; id da conta = editando uma conta existente
  const [editandoId, setEditandoId] = useState(null)
  const [idParaDeletar, setIdParaDeletar] = useState(null)
  // Evita duplo submit (duplo clique ou duplo Enter) — desabilita o botão até a requisição terminar
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchContas()
  }, [])

  const fetchContas = async () => {
    setLoading(true)
    try {
      const response = await api.get('/gastos-fixos')
      setContas(response.data)
      setError('')
    } catch (err) {
      setError(extrairMensagemErro(err, 'Erro ao carregar contas fixas'))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      // Campo opcional vazio vira null — string vazia quebraria o parse de Integer no backend
      const payload = { ...formData, totalParcelas: formData.totalParcelas || null }
      if (editandoId) {
        await api.put(`/gastos-fixos/${editandoId}`, payload)
      } else {
        await api.post('/gastos-fixos', payload)
      }
      fecharModal()
      await fetchContas()
    } catch (err) {
      setError(extrairMensagemErro(err, 'Erro ao salvar conta fixa'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!idParaDeletar) return
    try {
      await api.delete(`/gastos-fixos/${idParaDeletar}`)
      setIdParaDeletar(null)
      await fetchContas()
    } catch (err) {
      setIdParaDeletar(null)
      setError(extrairMensagemErro(err, 'Erro ao deletar conta fixa'))
    }
  }

  // Pausar preserva o molde (some da geração automática, mas não apaga o histórico já gerado)
  const handlePausarOuReativar = async (conta) => {
    try {
      const acao = conta.ativo ? 'pausar' : 'reativar'
      await api.patch(`/gastos-fixos/${conta.id}/${acao}`)
      await fetchContas()
    } catch (err) {
      setError(extrairMensagemErro(err, 'Erro ao atualizar conta fixa'))
    }
  }

  const handleMarcarComoPago = async (gastoDoMesId) => {
    try {
      await api.patch(`/gastos/${gastoDoMesId}/pagar`)
      await fetchContas()
    } catch (err) {
      setError(extrairMensagemErro(err, 'Erro ao marcar como pago'))
    }
  }

  const abrirCriacao = () => {
    setEditandoId(null)
    setFormData(FORM_VAZIO)
    setIsModalOpen(true)
  }

  const abrirEdicao = (conta) => {
    setEditandoId(conta.id)
    setFormData({
      categoria: conta.categoria,
      valor: conta.valor,
      descricao: conta.descricao,
      diaVencimento: conta.diaVencimento,
      dataInicio: conta.dataInicio,
      totalParcelas: conta.totalParcelas || '',
    })
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
      <PageHeader title="Contas Fixas">
        <Button onClick={abrirCriacao} disabled={modoDemo} title={modoDemo ? 'Desabilitado no modo demo' : undefined}>
          <Plus size={18} />
          Nova Conta Fixa
        </Button>
      </PageHeader>

      {error && (
        <Card className="border-negative border-opacity-30 p-4 text-negative text-sm">
          {error}
        </Card>
      )}

      {contas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contas.map((conta) => {
            const status = STATUS_INFO[conta.statusMesAtual] || STATUS_INFO.PENDENTE
            return (
              <Card key={conta.id} className={`p-6 space-y-4 ${!conta.ativo ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="label-uppercase text-text-secondary mb-1">{rotuloCategoria(conta.categoria)}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={status.badge}>{status.label}</Badge>
                      {!conta.ativo && <Badge>Pausada</Badge>}
                      {conta.totalParcelas && (
                        <Badge>
                          <span className="font-mono tabular-nums">{conta.parcelasPagas}/{conta.totalParcelas}</span> parcelas
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => handlePausarOuReativar(conta)}
                      disabled={modoDemo}
                      className="text-text-secondary hover:text-primary hover:bg-primary-50 p-2 rounded transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                      title={modoDemo ? 'Desabilitado no modo demo' : (conta.ativo ? 'Pausar' : 'Reativar')}
                    >
                      {conta.ativo ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                    <button
                      onClick={() => abrirEdicao(conta)}
                      disabled={modoDemo}
                      className="text-text-secondary hover:text-primary hover:bg-primary-50 p-2 rounded transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                      title={modoDemo ? 'Desabilitado no modo demo' : 'Editar'}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => setIdParaDeletar(conta.id)}
                      disabled={modoDemo}
                      className="text-negative hover:bg-red-50 p-2 rounded transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                      title={modoDemo ? 'Desabilitado no modo demo' : 'Remover'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-text-primary text-sm font-medium mb-1 truncate">{conta.descricao}</p>
                  <SaldoDisplay valor={Number(conta.valor)} className="text-2xl font-bold text-text-primary" />
                  <p className="text-text-secondary text-xs mt-1">
                    vence dia {conta.diaVencimento} · <span className="font-mono tabular-nums">{formatarDataCompleta(conta.dataVencimentoMesAtual)}</span>
                  </p>
                  {conta.totalParcelas && (
                    <p className="text-text-secondary text-xs mt-1">
                      restam <SaldoDisplay valor={(conta.totalParcelas - conta.parcelasPagas) * Number(conta.valor)} className="text-xs" />
                    </p>
                  )}
                </div>

                {conta.statusMesAtual !== 'PAGO' && conta.gastoDoMesId && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleMarcarComoPago(conta.gastoDoMesId)}
                    disabled={modoDemo}
                    title={modoDemo ? 'Desabilitado no modo demo' : undefined}
                  >
                    <CheckCircle2 size={16} />
                    Marcar como pago
                  </Button>
                )}
              </Card>
            )
          })}
        </div>
      ) : (
        <Card className="p-8">
          <EmptyState message="Nenhuma conta fixa cadastrada ainda — crie uma para não precisar relançar todo mês." />
        </Card>
      )}

      <ConfirmDialog
        isOpen={idParaDeletar !== null}
        message="Tem certeza que deseja remover esta conta fixa? Os gastos já gerados por ela continuam no histórico, mas ela para de gerar novos."
        onCancel={() => setIdParaDeletar(null)}
        onConfirm={handleDelete}
      />

      <Modal isOpen={isModalOpen} title={editandoId ? 'Editar Conta Fixa' : 'Nova Conta Fixa'} onClose={fecharModal}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Categoria"
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
            required
          >
            <option value="" disabled>Selecione uma categoria</option>
            {CATEGORIAS.map((cat) => (
              <option key={cat.valor} value={cat.valor}>{cat.rotulo}</option>
            ))}
          </Select>

          <Input
            label="Descrição"
            placeholder="Ex: Aluguel"
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            required
          />

          <Input
            label="Valor"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0,00"
            value={formData.valor}
            onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
            required
          />

          <Input
            label="Dia do Vencimento"
            type="number"
            min="1"
            max="31"
            placeholder="Ex: 10"
            value={formData.diaVencimento}
            onChange={(e) => setFormData({ ...formData, diaVencimento: e.target.value })}
            required
          />

          <Input
            label="A partir de"
            type="date"
            value={formData.dataInicio}
            onChange={(e) => setFormData({ ...formData, dataInicio: e.target.value })}
            required
          />

          <div>
            <Input
              label="Número de parcelas (opcional)"
              type="number"
              min="1"
              placeholder="Ex: 48"
              value={formData.totalParcelas}
              onChange={(e) => setFormData({ ...formData, totalParcelas: e.target.value })}
            />
            <p className="text-text-secondary text-xs mt-1">
              Deixe em branco para conta recorrente sem fim (aluguel, assinatura). Preencha pra financiamentos.
            </p>
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
    </div>
  )
}
