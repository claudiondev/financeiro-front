import { useState, useEffect } from 'react'
import { Trash2, Plus } from 'lucide-react'
import Modal from '../../components/Modal'
import api from '../../services/api'

export default function Gastos() {
  const [gastos, setGastos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({ categoria: '', valor: '', descricao: '', data: '' })

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
      setError('Erro ao carregar gastos')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/gastos', formData)
      setFormData({ categoria: '', valor: '', descricao: '', data: '' })
      setIsModalOpen(false)
      await fetchGastos()
    } catch (err) {
      setError('Erro ao salvar gasto')
    }
  }

  const handleDelete = async () => {
    if (!idParaDeletar) return
    try {
      await api.delete(`/gastos/${idParaDeletar}`)
      setIdParaDeletar(null)
      await fetchGastos()
    } catch (err) {
      setIdParaDeletar(null)
      setError('Erro ao deletar gasto')
    }
  }

  /*
   * Filtragem local por categoria (dentro do mês já carregado do servidor).
   * Derivamos as categorias disponíveis do próprio conjunto carregado,
   * garantindo que o dropdown só mostra categorias do mês selecionado.
   */
  const categorias = [...new Set(gastos.map(g => g.categoria))]
  const gastosExibidos = categoriaFilter
    ? gastos.filter(g => g.categoria === categoriaFilter)
    : gastos

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-text-secondary">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">Gastos</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-outlined-lg inline-flex items-center gap-2"
        >
          <Plus size={18} />
          Novo Gasto
        </button>
      </div>

      {/* Filtros — mês consulta o servidor, categoria filtra localmente */}
      <div className="flex gap-4 flex-wrap">
        <div>
          <label className="label-uppercase text-text-secondary block mb-2 text-xs">Mês</label>
          <input
            type="number"
            min="1"
            max="12"
            value={mesFilter}
            onChange={(e) => setMesFilter(Number(e.target.value))}
            className="input-dark px-3 py-2 w-20"
          />
        </div>
        <div>
          <label className="label-uppercase text-text-secondary block mb-2 text-xs">Categoria</label>
          <select
            value={categoriaFilter}
            onChange={(e) => setCategoriaFilter(e.target.value)}
            className="input-dark px-3 py-2"
          >
            <option value="">Todas</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="card-base border-negative border-opacity-30 p-4 text-negative text-sm">
          {error}
        </div>
      )}

      <div className="card-base overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-dark bg-surface">
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
                <tr key={gasto.id} className="border-b border-border-dark hover:bg-surface hover:bg-opacity-50">
                  <td className="px-6 py-4 text-text-secondary text-sm">{gasto.data}</td>
                  <td className="px-6 py-4">
                    <p className="text-text-primary text-sm font-medium">{gasto.descricao || '-'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="badge-category">{gasto.categoria}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-negative">
                    R$ {Number(gasto.valor).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => setIdParaDeletar(gasto.id)}
                      className="text-negative hover:text-negative hover:bg-negative hover:bg-opacity-10 p-2 rounded transition-colors"
                      title="Deletar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-text-secondary">
                  Nenhum gasto registrado para este período
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmação de exclusão */}
      <Modal
        isOpen={idParaDeletar !== null}
        title="Confirmar Exclusão"
        onClose={() => setIdParaDeletar(null)}
      >
        <div className="space-y-4">
          <p className="text-text-secondary text-sm">
            Tem certeza que deseja excluir este gasto? Esta ação não pode ser desfeita.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setIdParaDeletar(null)}
              className="flex-1 border border-border-dark text-text-secondary px-4 py-2 rounded hover:bg-surface"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 bg-negative bg-opacity-20 border border-negative border-opacity-40 text-negative px-4 py-2 rounded hover:bg-opacity-30"
            >
              Excluir
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de criação de gasto */}
      <Modal isOpen={isModalOpen} title="Novo Gasto" onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-uppercase text-text-secondary block mb-2 text-xs">Categoria</label>
            <input
              type="text"
              placeholder="Ex: Alimentação, Transporte"
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              className="input-dark w-full px-4 py-3"
              required
            />
          </div>

          <div>
            <label className="label-uppercase text-text-secondary block mb-2 text-xs">Valor</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0,00"
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              className="input-dark w-full px-4 py-3"
              required
            />
          </div>

          <div>
            <label className="label-uppercase text-text-secondary block mb-2 text-xs">Descrição</label>
            <textarea
              placeholder="Detalhes do gasto"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="input-dark w-full px-4 py-3 resize-none"
              rows="3"
            />
          </div>

          <div>
            <label className="label-uppercase text-text-secondary block mb-2 text-xs">Data</label>
            <input
              type="date"
              value={formData.data}
              onChange={(e) => setFormData({ ...formData, data: e.target.value })}
              className="input-dark w-full px-4 py-3"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 border border-border-dark text-text-secondary px-4 py-2 rounded hover:bg-surface"
            >
              Cancelar
            </button>
            <button type="submit" className="btn-outlined-lg flex-1">
              Salvar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
