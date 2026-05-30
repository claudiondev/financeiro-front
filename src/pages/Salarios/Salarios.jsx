import { useState, useEffect } from 'react'
import { Trash2, Plus } from 'lucide-react'
import Modal from '../../components/Modal'
import api from '../../services/api'

export default function Salarios() {
  const [salarios, setSalarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    valor: '',
    comissao: '',
    adicional: '',
    descricao: '',
    data: ''
  })

  useEffect(() => {
    fetchSalarios()
  }, [])

  const fetchSalarios = async () => {
    try {
      const response = await api.get('/salarios')
      setSalarios(response.data)
      setError('')
    } catch (err) {
      setError('Erro ao carregar salários')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/salarios', formData)
      setFormData({ valor: '', comissao: '', adicional: '', descricao: '', data: '' })
      setIsModalOpen(false)
      await fetchSalarios()
    } catch (err) {
      setError('Erro ao salvar entrada')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Deseja deletar esta entrada?')) return
    try {
      await api.delete(`/salarios/${id}`)
      await fetchSalarios()
    } catch (err) {
      setError('Erro ao deletar entrada')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-text-secondary">Carregando...</p>
      </div>
    )
  }

  const totalMes = salarios.reduce((acc, sal) => {
    return acc + (Number(sal.valor || 0) + Number(sal.comissao || 0) + Number(sal.adicional || 0))
  }, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">Salários e Entradas</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-outlined-lg inline-flex items-center gap-2"
        >
          <Plus size={18} />
          Nova Entrada
        </button>
      </div>

      <div className="card-base p-6">
        <p className="label-uppercase text-text-secondary mb-2">Total Recebido no Mês</p>
        <p className="text-4xl font-bold text-positive">R$ {totalMes.toFixed(2)}</p>
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
                  <tr key={salario.id} className="border-b border-border-dark hover:bg-surface hover:bg-opacity-50">
                    <td className="px-6 py-4 text-text-secondary text-sm">{salario.data}</td>
                    <td className="px-6 py-4">
                      <p className="text-text-primary text-sm font-medium">{salario.descricao || '-'}</p>
                    </td>
                    <td className="px-6 py-4 text-right text-text-primary font-medium">
                      R$ {Number(salario.valor || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right text-text-primary font-medium">
                      R$ {Number(salario.comissao || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right text-text-primary font-medium">
                      R$ {Number(salario.adicional || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-positive">
                      R$ {total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(salario.id)}
                        className="text-negative hover:text-negative hover:bg-negative hover:bg-opacity-10 p-2 rounded transition-colors"
                        title="Deletar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-text-secondary">
                  Nenhuma entrada registrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} title="Nova Entrada" onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-uppercase text-text-secondary block mb-2 text-xs">Valor Principal</label>
            <input
              type="number"
              step="0.01"
              placeholder="0,00"
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              className="input-dark w-full px-4 py-3"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-uppercase text-text-secondary block mb-2 text-xs">Comissão</label>
              <input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={formData.comissao}
                onChange={(e) => setFormData({ ...formData, comissao: e.target.value })}
                className="input-dark w-full px-4 py-3"
              />
            </div>
            <div>
              <label className="label-uppercase text-text-secondary block mb-2 text-xs">Adicional</label>
              <input
                type="number"
                step="0.01"
                placeholder="0,00"
                value={formData.adicional}
                onChange={(e) => setFormData({ ...formData, adicional: e.target.value })}
                className="input-dark w-full px-4 py-3"
              />
            </div>
          </div>

          <div>
            <label className="label-uppercase text-text-secondary block mb-2 text-xs">Descrição</label>
            <textarea
              placeholder="Ex: Salário Mensal"
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
            <button
              type="submit"
              className="btn-outlined-lg flex-1"
            >
              Salvar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
