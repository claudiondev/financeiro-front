import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import logoIcon from '../../assets/logo-icon.png'
import logoFull from '../../assets/logo-full.png'

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
    <div className="min-h-screen flex bg-background">
      {/* Painel de marca — só a partir de telas grandes */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-accent-600 items-center justify-center p-12">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-16 w-96 h-96 bg-accent-300 opacity-20 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-md text-white">
          <div className="inline-block bg-white bg-opacity-10 backdrop-blur rounded-2xl p-4 mb-8">
            <img src={logoIcon} alt="" className="w-16 h-16 object-contain drop-shadow-lg" />
          </div>
          <h1 className="text-4xl font-black leading-tight mb-4">
            Comece a decidir com números, não com achismo
          </h1>
          <p className="text-primary-100 text-lg">
            Cadastro gratuito. Leva menos de um minuto pra começar a organizar sua vida financeira.
          </p>
        </div>
      </div>

      {/* Formulário */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-10">
            <img src={logoFull} alt="Meu Controle Financeiro" className="h-20 mx-auto object-contain" />
          </div>

          <Card className="p-8 space-y-6 shadow-lg">
            <h2 className="text-xl font-bold text-text-primary">Crie sua conta</h2>

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
          </Card>
        </div>
      </div>
    </div>
  )
}
