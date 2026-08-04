import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import TelaAutenticacao from '../../components/TelaAutenticacao'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const [carregandoDemo, setCarregandoDemo] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setLoading(true)

    try {
      const response = await api.post('/auth/login', { email, senha })
      localStorage.setItem('token', response.data)
      navigate('/resumo')
    } catch (error) {
      /*
       * O backend retorna strings simples (não objetos com campo "message").
       * Exemplo: "Credenciais inválidas" com status 401.
       *
       * error.response.data já é a string de erro — usamos diretamente.
       * O fallback garante uma mensagem amigável se a resposta vier vazia.
       */
      const mensagemBackend = error.response?.data
      setErro(typeof mensagemBackend === 'string' && mensagemBackend
        ? mensagemBackend
        : 'Não foi possível fazer login. Verifique suas credenciais.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerDemo = async () => {
    setErro('')
    setCarregandoDemo(true)

    try {
      const response = await api.post('/auth/demo')
      localStorage.setItem('token', response.data)
      navigate('/resumo')
    } catch {
      setErro('Não foi possível abrir a demo agora. Tente novamente em instantes.')
    } finally {
      setCarregandoDemo(false)
    }
  }

  return (
    <TelaAutenticacao
      titulo="Controle financeiro que trabalha por você"
      subtitulo="Gastos, metas e um assistente que te ajuda a decidir melhor, todo santo dia."
    >
      <h2 className="text-xl font-bold text-text-primary">Bem-vindo de volta</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          id="senha"
          label="Senha"
          type="password"
          placeholder="••••••••"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        {erro && (
          <div className="bg-red-50 border border-negative border-opacity-30 text-negative text-sm p-3 rounded-lg">
            {erro}
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full" size="lg">
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      <div className="flex items-center gap-3 text-xs text-text-secondary">
        <div className="h-px flex-1 bg-border" />
        ou
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleVerDemo}
        disabled={carregandoDemo}
        className="w-full"
        size="lg"
      >
        {carregandoDemo ? 'Abrindo demo...' : 'Ver demo'}
      </Button>

      <div className="text-center text-sm text-text-secondary">
        Não tem uma conta?{' '}
        <Link to="/cadastro" className="text-accent-600 font-semibold hover:underline">
          Cadastre-se
        </Link>
      </div>
    </TelaAutenticacao>
  )
}
