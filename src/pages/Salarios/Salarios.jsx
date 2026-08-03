import { useState, useEffect } from 'react'
import { Trash2, Plus, Pencil } from 'lucide-react'
import Modal from '../../components/Modal'
import api, { extrairMensagemErro } from '../../services/api'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Textarea from '../../components/ui/Textarea'
import SaldoDisplay from '../../components/ui/SaldoDisplay'
import EmptyState from '../../components/ui/EmptyState'
import PageSkeleton from '../../components/ui/Skeleton'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { formatarDataCompleta, MESES } from '../../utils/data'

const FORM_VAZIO = { valor: '', comissao: '', adicional: '', descricao: '', data: '' }

export default function Salarios() {
  const [salarios, setSalarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState(FORM_VAZIO)
  // null = criando uma entrada nova; id do salário = editando uma entrada existente
  const [editandoId, setEditandoId] = useState(null)
  // Evita duplo submit (duplo clique ou duplo Enter) — desabilita o botão até a requisição terminar
  const [submitting, setSubmitting] = useState(false)

  /*
   * Estado para confirmação de exclusão sem window.confirm().
   *
   * Motivo: window.confirm() é um diálogo nativo do browser que não pode
   * ser estilizado e é bloqueado em alguns contextos (iframes, PWA).
   * Armazenamos o ID do registro a deletar — quando não nulo, o Modal de
   * confirmação aparece. Ao confirmar, o DELETE é executado e o estado é
   * zerado, fechando o modal.
   */
  const [idParaDeletar, setIdParaDeletar] = useState(null)

  // Mesmo padrão de Gastos.jsx: mês atual por padrão, meses anteriores ficam só no histórico
  const [mesFilter, setMesFilter] = useState(new Date().getMonth() + 1)

  useEffect(() => {
    fetchSalarios()
  }, [mesFilter])

  /*
   * Busca os salários do usuário autenticado, filtrados pelo mês selecionado.
   *
   * O endpoint correto é GET /salario/filtrar (singular "salario"), conforme
   * mapeado em SalarioController com @RequestMapping("/salario").
   */
  const fetchSalarios = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('mes', mesFilter)
      // O ano atual é implícito — pode ser parametrizado futuramente
      params.append('ano', new Date().getFullYear())

      const response = await api.get(`/salario/filtrar?${params.toString()}`)
      setSalarios(response.data)
      setError('')
    } catch (err) {
      setError(extrairMensagemErro(err, 'Erro ao carregar salários'))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      if (editandoId) {
        await api.put(`/salario/${editandoId}`, formData)
      } else {
        await api.post('/salario', formData)
      }
      fecharModal()
      await fetchSalarios()
    } catch (err) {
      setError(extrairMensagemErro(err, 'Erro ao salvar entrada'))
    } finally {
      setSubmitting(false)
    }
  }

  const abrirCriacao = () => {
    setEditandoId(null)
    setFormData(FORM_VAZIO)
    setIsModalOpen(true)
  }

  const abrirEdicao = (salario) => {
    setEditandoId(salario.id)
    setFormData({
      valor: salario.valor,
      comissao: salario.comissao ?? '',
      adicional: salario.adicional ?? '',
      descricao: salario.descricao || '',
      data: salario.data,
    })
    setIsModalOpen(true)
  }

  const fecharModal = () => {
    setIsModalOpen(false)
    setEditandoId(null)
    setFormData(FORM_VAZIO)
  }

  const handleDelete = async () => {
    if (!idParaDeletar) return
    try {
      // DELETE /salario/{id} — remove o registro pelo ID
      await api.delete(`/salario/${idParaDeletar}`)
      setIdParaDeletar(null)
      await fetchSalarios()
    } catch (err) {
      setIdParaDeletar(null)
      setError(extrairMensagemErro(err, 'Erro ao deletar entrada'))
    }
  }

  if (loading) {
    return <PageSkeleton />
  }

  /*
   * Calcula o total do mês somando valor base + comissão + adicional.
   * Usamos Number() para converter strings vindas do input ou do backend
   * antes de somar — evita concatenação acidental de strings ("100" + "50" = "10050").
   */
  const totalMes = salarios.reduce((acc, sal) => {
    return acc + (Number(sal.valor || 0) + Number(sal.comissao || 0) + Number(sal.adicional || 0))
  }, 0)

  return (
    <div className="space-y-6">
      <PageHeader title="Salários e Entradas">
        <Button onClick={abrirCriacao}>
          <Plus size={18} />
          Nova Entrada
        </Button>
      </PageHeader>

      <Select
        label="Mês"
        value={mesFilter}
        onChange={(e) => setMesFilter(Number(e.target.value))}
        className="w-40"
      >
        {MESES.map((mes) => (
          <option key={mes.numero} value={mes.numero}>{mes.nome}</option>
        ))}
      </Select>

      <Card className="p-6">
        <p className="label-uppercase text-text-secondary mb-2">Total Recebido no Mês</p>
        <SaldoDisplay valor={totalMes} className="text-4xl font-bold text-positive" />
      </Card>

      {error && (
        <Card className="border-negative border-opacity-30 p-4 text-negative text-sm">
          {error}
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-background">
              <th className="label-uppercase text-text-secondary text-left px-6 py-4">Data</th>
              <th className="label-uppercase text-text-secondary text-left px-6 py-4">Descrição</th>
              <th className="label-uppercase text-text-secondary text-right px-6 py-4">Valor Principal</th>
              <th className="label-uppercase text-text-secondary text-right px-6 py-4">Comissão</th>
              <th className="label-uppercase text-text-secondary text-right px-6 py-4">Adicional</th>
              <th className="label-uppercase text-text-secondary text-right px-6 py-4">Total</th>
              <th className="label-uppercase text-text-secondary text-center px-6 py-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {salarios.length > 0 ? (
              salarios.map((salario) => {
                const total = Number(salario.valor || 0) + Number(salario.comissao || 0) + Number(salario.adicional || 0)
                return (
                  <tr key={salario.id} className="border-b border-border hover:bg-background transition-colors">
                    <td className="px-6 py-4 text-text-secondary text-sm font-mono tabular-nums">{formatarDataCompleta(salario.data)}</td>
                    <td className="px-6 py-4">
                      <p className="text-text-primary text-sm font-medium">{salario.descricao || '-'}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <SaldoDisplay valor={Number(salario.valor || 0)} className="text-text-primary font-medium" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <SaldoDisplay valor={Number(salario.comissao || 0)} className="text-text-primary font-medium" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <SaldoDisplay valor={Number(salario.adicional || 0)} className="text-text-primary font-medium" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <SaldoDisplay valor={total} className="font-bold text-positive" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => abrirEdicao(salario)}
                          className="text-text-secondary hover:text-primary hover:bg-primary-50 p-2 rounded transition-colors"
                          title="Editar"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setIdParaDeletar(salario.id)}
                          className="text-negative hover:bg-red-50 p-2 rounded transition-colors"
                          title="Deletar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan="7">
                  <EmptyState message="Nenhuma entrada registrada para este mês" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </Card>

      <ConfirmDialog
        isOpen={idParaDeletar !== null}
        message="Tem certeza que deseja excluir esta entrada? Esta ação não pode ser desfeita."
        onCancel={() => setIdParaDeletar(null)}
        onConfirm={handleDelete}
      />

      {/* Modal de criação/edição de entrada — o mesmo form serve para os dois casos */}
      <Modal isOpen={isModalOpen} title={editandoId ? 'Editar Entrada' : 'Nova Entrada'} onClose={fecharModal}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Valor Principal"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0,00"
            value={formData.valor}
            onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Comissão"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={formData.comissao}
              onChange={(e) => setFormData({ ...formData, comissao: e.target.value })}
            />
            <Input
              label="Adicional"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              value={formData.adicional}
              onChange={(e) => setFormData({ ...formData, adicional: e.target.value })}
            />
          </div>

          <Textarea
            label="Descrição"
            placeholder="Ex: Salário Mensal"
            value={formData.descricao}
            onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
            rows="3"
          />

          <Input
            label="Data"
            type="date"
            value={formData.data}
            onChange={(e) => setFormData({ ...formData, data: e.target.value })}
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
