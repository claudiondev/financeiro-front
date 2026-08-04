import { useState } from 'react'
import { Upload, AlertTriangle, CheckCircle2 } from 'lucide-react'
import api, { extrairMensagemErro } from '../../services/api'
import PageHeader from '../../components/ui/PageHeader'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import SaldoDisplay from '../../components/ui/SaldoDisplay'
import { CATEGORIAS } from '../../constants/categorias'
import { formatarDataCompleta } from '../../utils/data'
import { useUsuario } from '../../context/UsuarioContext'

export default function Importacao() {
  const { usuario } = useUsuario()
  const modoDemo = usuario?.demo
  const [arquivo, setArquivo] = useState(null)
  const [transacoes, setTransacoes] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [confirmando, setConfirmando] = useState(false)
  const [error, setError] = useState('')
  const [resultado, setResultado] = useState(null)

  const handleEnviarArquivo = async (e) => {
    e.preventDefault()
    if (!arquivo) return
    setEnviando(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('arquivo', arquivo)
      const response = await api.post('/importacao/ofx', formData)
      // Cada transação lida ganha um estado local de revisão: incluir (desmarcado se já
      // importada) e categoria editável (só relevante pra quem é GASTO).
      setTransacoes(response.data.map((t) => ({
        ...t,
        incluir: !t.jaImportado,
        categoria: t.categoria || 'OUTROS',
      })))
    } catch (err) {
      setError(extrairMensagemErro(err, 'Erro ao ler o arquivo'))
    } finally {
      setEnviando(false)
    }
  }

  const atualizarTransacao = (fitid, campos) => {
    setTransacoes((atual) => atual.map((t) => (t.fitid === fitid ? { ...t, ...campos } : t)))
  }

  const handleConfirmar = async () => {
    const itens = transacoes
      .filter((t) => t.incluir)
      .map((t) => ({
        fitid: t.fitid,
        data: t.data,
        valor: t.valor,
        descricao: t.descricao,
        tipo: t.tipo,
        categoria: t.tipo === 'GASTO' ? t.categoria : null,
      }))

    if (itens.length === 0) return

    setConfirmando(true)
    setError('')
    try {
      const response = await api.post('/importacao/confirmar', { itens })
      setResultado(response.data)
      setTransacoes(null)
      setArquivo(null)
    } catch (err) {
      setError(extrairMensagemErro(err, 'Erro ao confirmar importação'))
    } finally {
      setConfirmando(false)
    }
  }

  const novaImportacao = () => {
    setResultado(null)
    setArquivo(null)
    setTransacoes(null)
    setError('')
  }

  const totalSelecionadas = transacoes?.filter((t) => t.incluir).length || 0

  return (
    <div className="space-y-6">
      <PageHeader title="Importar Extrato" />

      {error && (
        <Card className="border-negative border-opacity-30 p-4 text-negative text-sm">
          {error}
        </Card>
      )}

      {resultado && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-positive">
            <CheckCircle2 size={20} />
            <p className="font-semibold">Importação concluída</p>
          </div>
          <p className="text-text-secondary text-sm">
            {resultado.gastosCriados} gasto(s) e {resultado.salariosCriados} entrada(s) de renda criados.
          </p>
          <Button variant="outline" onClick={novaImportacao}>Importar outro arquivo</Button>
        </Card>
      )}

      {!transacoes && !resultado && (
        <Card className="p-6 space-y-4">
          <p className="text-text-secondary text-sm">
            Exporte o extrato do seu banco em formato <span className="font-mono">.ofx</span> e envie aqui.
            Você vai poder revisar categoria e desmarcar o que não quiser importar antes de confirmar.
          </p>
          <form onSubmit={handleEnviarArquivo} className="space-y-4">
            <input
              type="file"
              accept=".ofx"
              onChange={(e) => setArquivo(e.target.files[0] || null)}
              disabled={modoDemo}
              className="block w-full text-sm text-text-secondary file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border file:border-border file:bg-surface file:text-text-primary file:text-sm hover:file:bg-background"
            />
            <Button type="submit" disabled={!arquivo || enviando || modoDemo} title={modoDemo ? 'Desabilitado no modo demo' : undefined}>
              <Upload size={18} />
              {enviando ? 'Lendo arquivo...' : 'Ler arquivo'}
            </Button>
          </form>
        </Card>
      )}

      {transacoes && (
        <>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-background">
                    <th className="px-4 py-4 text-center w-10"></th>
                    <th className="label-uppercase text-text-secondary text-left px-4 py-4">Data</th>
                    <th className="label-uppercase text-text-secondary text-left px-4 py-4">Descrição</th>
                    <th className="label-uppercase text-text-secondary text-left px-4 py-4">Categoria</th>
                    <th className="label-uppercase text-text-secondary text-right px-4 py-4">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {transacoes.map((t) => (
                    <tr key={t.fitid} className={`border-b border-border ${!t.incluir ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={t.incluir}
                          onChange={(e) => atualizarTransacao(t.fitid, { incluir: e.target.checked })}
                        />
                      </td>
                      <td className="px-4 py-3 text-text-secondary text-sm font-mono tabular-nums">
                        {formatarDataCompleta(t.data)}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-text-primary text-sm">{t.descricao}</p>
                        {t.jaImportado && (
                          <p className="text-warning text-xs flex items-center gap-1 mt-0.5">
                            <AlertTriangle size={12} /> Já importado antes
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {t.tipo === 'GASTO' ? (
                          <Select
                            value={t.categoria}
                            onChange={(e) => atualizarTransacao(t.fitid, { categoria: e.target.value })}
                            className="py-2 text-sm"
                          >
                            {CATEGORIAS.map((cat) => (
                              <option key={cat.valor} value={cat.valor}>{cat.rotulo}</option>
                            ))}
                          </Select>
                        ) : (
                          <span className="text-text-secondary text-sm">Renda</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <SaldoDisplay
                          valor={Number(t.valor)}
                          className={`font-semibold ${t.tipo === 'GASTO' ? 'text-negative' : 'text-positive'}`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="flex items-center justify-between">
            <p className="text-text-secondary text-sm">{totalSelecionadas} de {transacoes.length} selecionadas</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={novaImportacao} disabled={confirmando}>
                Cancelar
              </Button>
              <Button onClick={handleConfirmar} disabled={confirmando || totalSelecionadas === 0}>
                {confirmando ? 'Confirmando...' : `Confirmar importação (${totalSelecionadas})`}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
