import { useEffect, useState } from 'react'
import api, { extrairMensagemErro } from '../services/api'
import Card from './ui/Card'
import Button from './ui/Button'
import Textarea from './ui/Textarea'

const SUGESTOES = [
  'Quanto gastei com transporte neste mês?',
  'Quais foram meus maiores gastos neste mês?',
  'Como estão meus orçamentos neste mês?',
]

function formatarResposta(texto) {
  // O modelo pode devolver negrito em Markdown mesmo quando pedimos texto simples.
  return texto.split(/(\*\*[^*\n]+\*\*)/g).map((trecho, indice) =>
    trecho.startsWith('**') && trecho.endsWith('**')
      ? <strong key={indice} className="font-semibold">{trecho.slice(2, -2)}</strong>
      : trecho,
  )
}

export default function ChatAssistente() {
  const [habilitado, setHabilitado] = useState(false)
  const [carregandoStatus, setCarregandoStatus] = useState(true)
  const [sessao, setSessao] = useState(null)
  const [mensagens, setMensagens] = useState([])
  const [pergunta, setPergunta] = useState('')
  const [aceitouAviso, setAceitouAviso] = useState(false)
  const [processando, setProcessando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true
    api.get('/assistente/chat/status')
      .then(({ data }) => { if (ativo) setHabilitado(data.habilitado) })
      .catch(() => { if (ativo) setHabilitado(false) })
      .finally(() => { if (ativo) setCarregandoStatus(false) })
    return () => { ativo = false }
  }, [])

  const criarSessao = async () => {
    const { data } = await api.post('/assistente/chat/sessoes')
    setSessao(data.sessao)
    return data.sessao
  }

  const enviar = async (evento) => {
    evento.preventDefault()
    const texto = pergunta.trim()
    if (!texto || !aceitouAviso || processando) return
    setErro('')
    setProcessando(true)
    try {
      const segredo = sessao || await criarSessao()
      const requisicaoId = crypto.randomUUID()
      const { data } = await api.post('/assistente/chat/mensagens',
        { mensagem: texto, requisicaoId },
        { headers: { 'X-Assistente-Sessao': segredo } },
      )
      setMensagens((atuais) => [
        ...atuais,
        { id: requisicaoId, papel: 'usuario', texto },
        { id: `${requisicaoId}-resposta`, papel: 'assistente', texto: data.resposta },
      ])
      setPergunta('')
    } catch (falha) {
      if (falha.response?.status === 404) {
        setSessao(null)
        setMensagens([])
        setErro('A conversa expirou. Envie sua pergunta novamente para começar outra.')
      } else {
        setErro(extrairMensagemErro(falha, 'Não foi possível responder agora. Tente novamente.'))
      }
    } finally {
      setProcessando(false)
    }
  }

  const novaConversa = async () => {
    if (processando) return
    setErro('')
    try {
      if (sessao) {
        await api.delete('/assistente/chat/sessao', { headers: { 'X-Assistente-Sessao': sessao } })
      }
      setSessao(null)
      setMensagens([])
      setPergunta('')
    } catch (falha) {
      if (falha.response?.status === 404) {
        setSessao(null)
        setMensagens([])
        setPergunta('')
      } else {
        setErro(extrairMensagemErro(falha, 'Não foi possível iniciar uma nova conversa.'))
      }
    }
  }

  if (carregandoStatus || !habilitado) return null

  return (
    <Card className="p-5 sm:p-7 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Pergunte sobre seus números</h2>
          <p className="text-sm text-text-secondary mt-1">
            Consulte gastos, períodos e orçamentos registrados no app.
          </p>
        </div>
        {mensagens.length > 0 && (
          <Button type="button" variant="outline" size="sm" onClick={novaConversa} disabled={processando}>
            Nova conversa
          </Button>
        )}
      </div>

      {mensagens.length === 0 && (
        <div className="flex flex-wrap gap-2" aria-label="Perguntas sugeridas">
          {SUGESTOES.map((sugestao) => (
            <button key={sugestao} type="button" onClick={() => setPergunta(sugestao)}
              className="rounded-lg border border-border px-3 py-2 text-sm text-text-primary text-left hover:bg-background focus-visible:ring-2 focus-visible:ring-primary-300">
              {sugestao}
            </button>
          ))}
        </div>
      )}

      {mensagens.length > 0 && (
        <div className="space-y-3 max-h-96 overflow-y-auto" aria-live="polite">
          {mensagens.map((mensagem) => (
            <div key={mensagem.id} className={`flex ${mensagem.papel === 'usuario' ? 'justify-end' : 'justify-start'}`}>
              <p className={`max-w-[90%] rounded-xl px-4 py-3 text-sm whitespace-pre-wrap break-words ${mensagem.papel === 'usuario' ? 'bg-primary text-white' : 'bg-background text-text-primary'}`}>
                {mensagem.papel === 'assistente' ? formatarResposta(mensagem.texto) : mensagem.texto}
              </p>
            </div>
          ))}
        </div>
      )}

      {processando && <p className="text-sm text-text-secondary" role="status">Analisando seus dados...</p>}
      {erro && <p className="text-sm text-negative" role="alert">{erro}</p>}

      {!aceitouAviso && (
        <label className="flex items-start gap-2 text-sm text-text-secondary">
          <input type="checkbox" checked={aceitouAviso} onChange={(e) => setAceitouAviso(e.target.checked)}
            className="mt-1 accent-primary" />
          <span>Entendo que minha pergunta e os dados necessários para respondê-la serão processados pela OpenAI.</span>
        </label>
      )}

      <form onSubmit={enviar} className="space-y-3">
        <Textarea id="pergunta-assistente" label="Sua pergunta" value={pergunta}
          onChange={(e) => setPergunta(e.target.value)} maxLength={1000} rows={3}
          placeholder="Ex.: Quanto gastei com alimentação entre janeiro e junho?"
          disabled={processando} />
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-text-secondary">{pergunta.length}/1000</span>
          <Button type="submit" disabled={processando || !aceitouAviso || !pergunta.trim()}>
            {processando ? 'Aguarde...' : 'Enviar pergunta'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
