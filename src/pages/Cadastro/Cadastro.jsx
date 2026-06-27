import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'

export default function Cadastro() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [repetirSenha, setRepetirSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')

    // Validação client-side: evita roundtrip ao servidor para erros previsíveis
    if (senha !== repetirSenha) {
      setErro('As senhas não coincidem')
      return
    }

    if (senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres')
      return
    }

    setLoading(true)

    try {
      /*
       * Enviamos apenas email e senha — o campo "nome" foi removido porque
       * o backend não possui esse campo no model Usuario. Coletar um dado
       * que é descartado no servidor é enganoso para o usuário e não segue
       * o princípio de minimização de dados.
       *
       * Para adicionar nome no futuro: criar campo em Usuario.java,
       * gerar migration ALTER TABLE, e restaurar o campo aqui.
       */
      await api.post('/auth/registrar', { email, senha })
      navigate('/login')
    } catch (error) {
      /*
       * O backend retorna strings simples. Exemplos:
       *   409 → "E-mail já cadastrado."
       *   400 → mensagem de validação do @Valid
       *
       * Exibimos a mensagem do backend diretamente quando disponível.
       * O fallback genérico cobre erros de rede ou respostas inesperadas.
       */
      const mensagemBackend = error.response?.data
      setErro(typeof mensagemBackend === 'string' && mensagemBackend
        ? mensagemBackend
        : 'Erro ao realizar cadastro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Meu Controle Financeiro</h1>
          <p className="text-text-secondary text-sm">Crie sua conta gratuita</p>
        </div>

        <div className="card-base p-8 space-y-6">
          <h2 className="text-xl font-bold text-text-primary uppercase tracking-wider">Cadastro</h2>

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
                placeholder="Crie uma senha (mín. 6 caracteres)"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="input-dark w-full px-4 py-3"
                required
              />
            </div>

            <div>
              <label className="label-uppercase text-text-secondary block mb-2">Confirmar Senha</label>
              <input
                type="password"
                placeholder="Repita a senha"
                value={repetirSenha}
                onChange={(e) => setRepetirSenha(e.target.value)}
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
              {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
            </button>
          </form>

          <div className="text-center text-sm text-text-secondary">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-accent font-semibold hover:underline">
              Fazer login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
