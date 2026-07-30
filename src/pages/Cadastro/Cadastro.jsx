import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import TelaAutenticacao from '../../components/TelaAutenticacao'

export default function Cadastro() {
  const [nome, setNome] = useState('')
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
      // nome é opcional — quem não preencher vê a parte antes do @ do e-mail como fallback
      await api.post('/auth/registrar', { nome: nome || null, email, senha })
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
    <TelaAutenticacao
      titulo="Comece a decidir com números, não com achismo"
      subtitulo="Cadastro gratuito. Leva menos de um minuto pra começar a organizar sua vida financeira."
    >
      <h2 className="text-xl font-bold text-text-primary">Crie sua conta</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="nome"
          label="Nome (opcional)"
          type="text"
          placeholder="Como podemos te chamar?"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

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
          placeholder="Crie uma senha (mín. 6 caracteres)"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <Input
          id="repetirSenha"
          label="Confirmar Senha"
          type="password"
          placeholder="Repita a senha"
          value={repetirSenha}
          onChange={(e) => setRepetirSenha(e.target.value)}
          required
        />

        {erro && (
          <div className="bg-red-50 border border-negative border-opacity-30 text-negative text-sm p-3 rounded-lg">
            {erro}
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full" size="lg">
          {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
        </Button>
      </form>

      <div className="text-center text-sm text-text-secondary">
        Já tem uma conta?{' '}
        <Link to="/login" className="text-accent-600 font-semibold hover:underline">
          Fazer login
        </Link>
      </div>
    </TelaAutenticacao>
  )
}
