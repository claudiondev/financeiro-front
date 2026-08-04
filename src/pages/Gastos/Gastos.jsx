import { useState, useEffect } from 'react'
import { Trash2, Plus, Pencil, AlertTriangle, X } from 'lucide-react'
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
import { CATEGORIAS, rotuloCategoria, corHexCategoria } from '../../constants/categorias'
import { FORMAS_PAGAMENTO, FORMA_QUE_PARCELA, rotuloFormaPagamento } from '../../constants/formasPagamento'
import { formatarDataCompleta, MESES } from '../../utils/data'
import { useUsuario } from '../../context/UsuarioContext'

const FORM_VAZIO = { categoria: '', valor: '', descricao: '', data: '', formaPagamento: '', totalParcelas: '' }

export default function Gastos() {
  const { usuario } = useUsuario()
  const modoDemo = usuario?.demo
  const [gastos, setGastos] = useState([])
  const [parcelamentos, setParcelamentos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState(FORM_VAZIO)
  // null = criando um gasto novo; id do gasto = editando um gasto existente
  const [editandoId, setEditandoId] = useState(null)
  // Evita duplo submit (duplo clique ou duplo Enter) — desabilita o botão até a requisição terminar
  const [submitting, setSubmitting] = useState(false)

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
   * Solução: armazena o gasto a ser deletado em "gastoParaDeletar" (o objeto
   * inteiro, não só o id — precisamos saber se é parcela pra escolher o
   * endpoint certo e o texto de confirmação). Quando não nulo, o Modal de
   * confirmação é exibido. Ao confirmar, a deleção é executada e o estado é
   * resetado para null (fecha o modal).
   */
  const [gastoParaDeletar, setGastoParaDeletar] = useState(null)

  // Aviso não bloqueante do Assistente quando o gasto criado estoura/aproxima o orçamento da categoria
  const [avisoOrcamento, setAvisoOrcamento] = useState(null)

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

  useEffect(() => {
    fetchParcelamentos()
  }, [])

  // Compras parceladas em aberto — independente do mês filtrado, é uma visão do
  // que ainda está "rolando". Falha silenciosamente: é complemento, não o dado central.
  const fetchParcelamentos = async () => {
    try {
      const response = await api.get('/gastos/parcelamentos')
      setParcelamentos(response.data)
    } catch {
      setParcelamentos([])
    }
  }

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
    if (submitting) return
    setSubmitting(true)
    try {
      // Campos opcionais vazios viram null — string vazia quebraria o enum no backend
      const payload = {
        ...formData,
        formaPagamento: formData.formaPagamento || null,
        totalParcelas: podeParcelar ? Number(formData.totalParcelas) || null : null,
      }

      if (editandoId) {
        await api.put(`/gastos/${editandoId}`, payload)
      } else {
        const response = await api.post('/gastos', payload)
        setAvisoOrcamento(response.data.avisoOrcamento || null)
      }
      fecharModal()
      await Promise.all([fetchGastos(), fetchParcelamentos()])
    } catch (err) {
      setError(extrairMensagemErro(err, 'Erro ao salvar gasto'))
    } finally {
      setSubmitting(false)
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
      formaPagamento: gasto.formaPagamento || '',
      // Parcelamento não é editável depois de criado — editar afeta só esta parcela
      totalParcelas: '',
    })
    setIsModalOpen(true)
  }

  const fecharModal = () => {
    setIsModalOpen(false)
    setEditandoId(null)
    setFormData(FORM_VAZIO)
  }

  const handleDelete = async () => {
    if (!gastoParaDeletar) return
    // Parcela: apaga a compra parcelada inteira (única forma permitida pelo backend) —
    // uma parcela isolada não pode ser removida sem deixar as demais inconsistentes.
    const ehParcelado = gastoParaDeletar.totalParcelas > 1
    const url = ehParcelado
      ? `/gastos/${gastoParaDeletar.id}/parcelamento`
      : `/gastos/${gastoParaDeletar.id}`
    try {
      await api.delete(url)
      setGastoParaDeletar(null)
      await Promise.all([fetchGastos(), fetchParcelamentos()])
    } catch (err) {
      setGastoParaDeletar(null)
      setError(extrairMensagemErro(err, 'Erro ao deletar gasto'))
    }
  }

  // Filtragem local por categoria (dentro do mês já carregado do servidor)
  const categoriasDoMes = [...new Set(gastos.map((g) => g.categoria))]
  const gastosExibidos = categoriaFilter
    ? gastos.filter((g) => g.categoria === categoriaFilter)
    : gastos

  // Parcelar só faz sentido no crédito (mesma regra validada no backend)
  const podeParcelar = formData.formaPagamento === FORMA_QUE_PARCELA

  if (loading) {
    return <PageSkeleton />
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Gastos">
        <Button onClick={abrirCriacao} disabled={modoDemo} title={modoDemo ? 'Desabilitado no modo demo' : undefined}>
          <Plus size={18} />
          Novo Gasto
        </Button>
      </PageHeader>

      {avisoOrcamento && (
        <div className={`flex items-start gap-3 text-sm font-medium rounded-lg px-4 py-3 border ${
          avisoOrcamento.severidade === 'CRITICO'
            ? 'text-negative bg-red-50 border-negative border-opacity-30'
            : 'text-warning bg-orange-50 border-warning border-opacity-30'
        }`}>
          <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
          <span className="flex-1">{avisoOrcamento.mensagem}</span>
          <button onClick={() => setAvisoOrcamento(null)} className="flex-shrink-0 hover:opacity-70" title="Dispensar">
            <X size={16} />
          </button>
        </div>
      )}

      {parcelamentos.length > 0 && (
        <Card className="p-6">
          <h2 className="label-uppercase text-text-secondary mb-1">Parcelamentos em aberto</h2>
          <div className="divide-y divide-border">
            {parcelamentos.map((p) => (
              <div key={p.grupoParcelamento} className="flex items-center gap-3 py-3">
                <span
                  className="w-2.5 h-2.5 flex-shrink-0"
                  style={{ backgroundColor: corHexCategoria(p.categoria) }}
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary font-medium truncate">{p.descricao}</p>
                  <p className="text-xs text-text-secondary">
                    <span className="font-mono tabular-nums">{p.parcelasPagas}/{p.totalParcelas}</span>
                    {' pagas · termina em '}
                    <span className="font-mono tabular-nums">{formatarDataCompleta(p.ultimaParcela)}</span>
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <SaldoDisplay valor={Number(p.valorRestante)} className="text-sm font-semibold text-text-primary" />
                  <p className="text-xs text-text-secondary">restante</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Filtros — mês consulta o servidor, categoria filtra localmente */}
      <div className="flex gap-4 flex-wrap">
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
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-background">
              <th className="label-uppercase text-text-secondary text-left px-6 py-4">Data</th>
              <th className="label-uppercase text-text-secondary text-left px-6 py-4">Descrição</th>
              <th className="label-uppercase text-text-secondary text-left px-6 py-4">Categoria</th>
              <th className="label-uppercase text-text-secondary text-left px-6 py-4">Pagamento</th>
              <th className="label-uppercase text-text-secondary text-right px-6 py-4">Valor</th>
              <th className="label-uppercase text-text-secondary text-center px-6 py-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {gastosExibidos.length > 0 ? (
              gastosExibidos.map((gasto) => (
                <tr key={gasto.id} className="border-b border-border hover:bg-background transition-colors">
                  <td className="px-6 py-4 text-text-secondary text-sm font-mono tabular-nums">{formatarDataCompleta(gasto.data)}</td>
                  <td className="px-6 py-4">
                    <p className="text-text-primary text-sm font-medium">{gasto.descricao || '-'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 flex-shrink-0"
                        style={{ backgroundColor: corHexCategoria(gasto.categoria) }}
                        aria-hidden="true"
                      />
                      <span className="text-sm text-text-primary">{rotuloCategoria(gasto.categoria)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-text-secondary">{rotuloFormaPagamento(gasto.formaPagamento)}</span>
                    {gasto.totalParcelas > 1 && (
                      <span className="ml-2 text-xs font-mono tabular-nums text-text-secondary bg-background border border-border px-1.5 py-0.5 rounded">
                        {gasto.numeroParcela}/{gasto.totalParcelas}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <SaldoDisplay valor={Number(gasto.valor)} className="font-bold text-negative" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => abrirEdicao(gasto)}
                        disabled={modoDemo}
                        className="text-text-secondary hover:text-primary hover:bg-primary-50 p-2 rounded transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                        title={modoDemo ? 'Desabilitado no modo demo' : 'Editar'}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => setGastoParaDeletar(gasto)}
                        disabled={modoDemo}
                        className="text-negative hover:bg-red-50 p-2 rounded transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                        title={modoDemo ? 'Desabilitado no modo demo' : (gasto.totalParcelas > 1 ? 'Deletar compra parcelada inteira' : 'Deletar')}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">
                  <EmptyState message="Nenhum gasto registrado para este período" />
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </Card>

      <ConfirmDialog
        isOpen={gastoParaDeletar !== null}
        message={
          gastoParaDeletar?.totalParcelas > 1
            ? `Tem certeza que deseja excluir esta compra parcelada? As ${gastoParaDeletar.totalParcelas} parcelas serão apagadas. Esta ação não pode ser desfeita.`
            : 'Tem certeza que deseja excluir este gasto? Esta ação não pode ser desfeita.'
        }
        onCancel={() => setGastoParaDeletar(null)}
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

          <Select
            label="Forma de pagamento (opcional)"
            value={formData.formaPagamento}
            onChange={(e) => setFormData({
              ...formData,
              formaPagamento: e.target.value,
              // Trocar pra uma forma que não parcela limpa o campo de parcelas
              totalParcelas: e.target.value === FORMA_QUE_PARCELA ? formData.totalParcelas : '',
            })}
          >
            <option value="">Não informar</option>
            {FORMAS_PAGAMENTO.map((forma) => (
              <option key={forma.valor} value={forma.valor}>{forma.rotulo}</option>
            ))}
          </Select>

          {/* Parcelamento só existe no crédito, e não é editável depois de criado */}
          {podeParcelar && !editandoId && (
            <Input
              label="Parcelas"
              type="number"
              min="1"
              max="48"
              placeholder="1"
              value={formData.totalParcelas}
              onChange={(e) => setFormData({ ...formData, totalParcelas: e.target.value })}
            />
          )}

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
