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
import Badge from '../../components/ui/Badge'
import EmptyState from '../../components/ui/EmptyState'
import PageSkeleton from '../../components/ui/Skeleton'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { CATEGORIAS, rotuloCategoria } from '../../constants/categorias'

const FORM_VAZIO = { categoria: '', valor: '', descricao: '', data: '' }

export default function Gastos() {
  const [gastos, setGastos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState(FORM_VAZIO)
  // null = criando um gasto novo; id do gasto = editando um gasto existente
  const [editandoId, setEditandoId] = useState(null)

  // Filtros de busca
  const [mesFilter, setMesFilter] = useState(new Date().getMonth() + 1)
  const [categoriaFilter, setCategoriaFilter] = useState('')

  /*
   * Estado para confirmação de exclusão sem window.confirm().
   *
   * Por que não usar window.confirm()?
   * window.confirm() é uma API nativa do browser que abre um diálogo modal
   * bloqueante. Alguns browsers modernos bloqueiam esse diálogo em certos
   * contextos (iframes, extensões). Além disso, não pode ser estilizado.
   *
   * Solução: armazena o ID do gasto a ser deletado em "idParaDeletar".
   * Quando não nulo, o Modal de confirmação é exibido. Ao confirmar, a
   * deleção é executada e o estado é resetado para null (fecha o modal).
   */
  const [idParaDeletar, setIdParaDeletar] = useState(null)

  /*
   * Busca os gastos no servidor aplicando os filtros de mês e categoria.
   *
   * Por que usar o endpoint /gastos/filtrar em vez de filtrar no cliente?
   * Filtrar no servidor é mais eficiente: com muitos registros, carregar
   * todos para filtrar no browser desperdiça banda e memória. O backend
   * já tem a query JPQL parametrizada para isso.
   *
   * useEffect com [mesFilter]: recarrega automaticamente quando o mês muda.
   * O filtro de categoria é aplicado localmente (já que os dados do mês
   * já estão carregados — evitamos uma nova chamada de rede para cada
   * mudança de categoria).
   */
  useEffect(() => {
    fetchGastos()
    // Reseta o filtro de categoria ao mudar o mês, evitando estado inconsistente
    setCategoriaFilter('')
  }, [mesFilter])

  const fetchGastos = async () => {
    setLoading(true)
    try {
      /*
       * Monta os parâmetros de query opcionais.
       * URLSearchParams garante encoding correto (espaços, acentos, etc.)
       */
      const params = new URLSearchParams()
      params.append('mes', mesFilter)
      // O ano atual é implícito — pode ser parametrizado futuramente
      params.append('ano', new Date().getFullYear())

      const response = await api.get(`/gastos/filtrar?${params.toString()}`)
      setGastos(response.data)
      setError('')
    } catch (err) {
      setError(extrairMensagemErro(err, 'Erro ao carregar gastos'))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editandoId) {
        await api.put(`/gastos/${editandoId}`, formData)
      } else {
        await api.post('/gastos', formData)
      }
      fecharModal()
      await fetchGastos()
    } catch (err) {
      setError(extrairMensagemErro(err, 'Erro ao salvar gasto'))
    }
  }

  const abrirCriacao = () => {
    setEditandoId(null)
    setFormData(FORM_VAZIO)
    setIsModalOpen(true)
  }

  const abrirEdicao = (gasto) => {
    setEditandoId(gasto.id)
    setFormData({
      categoria: gasto.categoria,
      valor: gasto.valor,
      descricao: gasto.descricao || '',
      data: gasto.data,
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
      await api.delete(`/gastos/${idParaDeletar}`)
      setIdParaDeletar(null)
      await fetchGastos()
    } catch (err) {
      setIdParaDeletar(null)
      setError(extrairMensagemErro(err, 'Erro ao deletar gasto'))
    }
  }

  // Filtragem local por categoria (dentro do mês já carregado do servidor)
  const categoriasDoMes = [...new Set(gastos.map((g) => g.categoria))]
  const gastosExibidos = categoriaFilter
    ? gastos.filter((g) => g.categoria === categoriaFilter)
    : gastos

  if (loading) {
    return <PageSkeleton />
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Gastos">
        <Button onClick={abrirCriacao}>
          <Plus size={18} />
          Novo Gasto
        </Button>
      </PageHeader>

      {/* Filtros — mês consulta o servidor, categoria filtra localmente */}
      <div className="flex gap-4 flex-wrap">
        <Input
          label="Mês"
          type="number"
          min="1"
          max="12"
          value={mesFilter}
          onChange={(e) => setMesFilter(Number(e.target.value))}
          className="w-20"
        />
        <Select
          label="Categoria"
          value={categoriaFilter}
          onChange={(e) => setCategoriaFilter(e.target.value)}
          className="w-48"
        >
          <option value="">Todas</option>
          {categoriasDoMes.map((cat) => (
            <option key={cat} value={cat}>{rotuloCategoria(cat)}</option>
          ))}
        </Select>
      </div>

      {error && (
        <Card className="border-negative border-opacity-30 p-4 text-negative text-sm">
          {error}
        </Card>
      )}

      <Card className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-background">
              <th className="label-uppercase text-text-secondary text-left px-6 py-4">Data</th>
              <th className="label-uppercase text-text-secondary text-left px-6 py-4">Descrição</th>
              <th className="label-uppercase text-text-secondary text-left px-6 py-4">Categoria</th>
              <th className="label-uppercase text-text-secondary text-right px-6 py-4">Valor</th>
              <th className="label-uppercase text-text-secondary text-center px-6 py-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {gastosExibidos.length > 0 ? (
              gastosExibidos.map((gasto) => (
                <tr key={gasto.id} className="border-b border-border hover:bg-background transition-colors">
                  <td className="px-6 py-4 text-text-secondary text-sm">{gasto.data}</td>
                  <td className="px-6 py-4">
                    <p className="text-text-primary text-sm font-medium">{gasto.descricao || '-'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge>{rotuloCategoria(gasto.categoria)}</Badge>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-negative">
                    R$ {Number(gasto.valor).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => abrirEdicao(gasto)}
                        className="text-text-secondary hover:text-primary hover:bg-primary-50 p-2 rounded transition-colors"
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setIdParaDeletar(gasto.id)}
                        className="text-negative hover:bg-red-50 p-2 rounded transition-colors"
                        title="Deletar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">
                  <EmptyState message="Nenhum gasto registrado para este período" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      <ConfirmDialog
        isOpen={idParaDeletar !== null}
        message="Tem certeza que deseja excluir este gasto? Esta ação não pode ser desfeita."
        onCancel={() => setIdParaDeletar(null)}
        onConfirm={handleDelete}
      />

      {/* Modal de criação/edição de gasto — o mesmo form serve para os dois casos */}
      <Modal isOpen={isModalOpen} title={editandoId ? 'Editar Gasto' : 'Novo Gasto'} onClose={fecharModal}>
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
            label="Valor"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0,00"
            value={formData.valor}
            onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
            required
          />

          <Textarea
            label="Descrição"
            placeholder="Detalhes do gasto"
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
            <Button type="button" variant="outline" className="flex-1" onClick={fecharModal}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Salvar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
