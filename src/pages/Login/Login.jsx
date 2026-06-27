import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
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

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Meu Controle Financeiro</h1>
          <p className="text-text-secondary text-sm">Gerencie suas finanças com sabedoria</p>
        </div>

        <div className="card-base p-8 space-y-6">
          <h2 className="text-xl font-bold text-text-primary uppercase tracking-wider">Bem-vindo</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-uppercase text-text-secondary block mb-2">Email</label>
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-dark w-full px-4 py-3"
                required
              />
            </div>

            <div>
              <label className="label-uppercase text-text-secondary block mb-2">Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="input-dark w-full px-4 py-3"
                required
              />
            </div>

            {erro && (
              <div className="bg-negative bg-opacity-10 border border-negative border-opacity-30 text-negative text-sm p-3 rounded">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-outlined-lg w-full disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="text-center text-sm text-text-secondary">
            Não tem uma conta?{' '}
            <Link to="/cadastro" className="text-accent font-semibold hover:underline">
              Cadastre-se
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
