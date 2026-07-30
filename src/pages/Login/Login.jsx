import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../services/api'
import Card from '../../components/ui/Card'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import logoIcon from '../../assets/logo-icon.png'
import logoFull from '../../assets/logo-full.png'

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
      // O backend ainda não tem um campo "nome" em Usuario — usamos o e-mail
      // como identificação exibida no Sidebar até essa feature existir.
      localStorage.setItem('userName', email)
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
            Controle financeiro que trabalha por você
          </h1>
          <p className="text-primary-100 text-lg">
            Gastos, metas e um assistente que te ajuda a decidir melhor, todo santo dia.
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

            <div className="text-center text-sm text-text-secondary">
              Não tem uma conta?{' '}
              <Link to="/cadastro" className="text-accent-600 font-semibold hover:underline">
                Cadastre-se
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
