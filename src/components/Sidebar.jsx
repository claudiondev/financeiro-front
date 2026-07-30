import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut, Home, Wallet, FileText, Zap, Target, TrendingUp, Repeat, Pencil } from 'lucide-react'
import { useState, useEffect } from 'react'
import api, { extrairMensagemErro } from '../services/api'
import Modal from './Modal'
import Input from './ui/Input'
import Button from './ui/Button'
import logoIcon from '../assets/logo-icon.png'

export default function Sidebar() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [nomeForm, setNomeForm] = useState('')
  const [erro, setErro] = useState('')

  useEffect(() => {
    fetchUsuario()
  }, [])

  const fetchUsuario = async () => {
    try {
      const response = await api.get('/usuario/me')
      setUsuario(response.data)
    } catch {
      // Sem bloqueio: o resto da tela funciona normalmente mesmo se isso falhar
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const abrirEdicaoDeNome = () => {
    setNomeForm(usuario?.nome || '')
    setErro('')
    setIsModalOpen(true)
  }

  const handleSalvarNome = async (e) => {
    e.preventDefault()
    try {
      const response = await api.put('/usuario/perfil', { nome: nomeForm || null })
      setUsuario(response.data)
      setIsModalOpen(false)
    } catch (err) {
      setErro(extrairMensagemErro(err, 'Erro ao salvar nome'))
    }
  }

  // Sem nome definido (conta antiga ou quem pulou o campo no cadastro): usa a
  // parte antes do @ do e-mail em vez de mostrar o e-mail inteiro.
  const nomeExibido = usuario?.nome || usuario?.email?.split('@')[0] || ''

  const navItems = [
    { name: 'Resumo', path: '/resumo', icon: Home },
    { name: 'Gastos', path: '/gastos', icon: Wallet },
    { name: 'Salário', path: '/salarios', icon: Zap },
    { name: 'Contas Fixas', path: '/contas-fixas', icon: Repeat },
    { name: 'Metas', path: '/metas', icon: Target },
    { name: 'Evolução', path: '/evolucao', icon: TrendingUp },
    { name: 'Relatórios', path: '/relatorios', icon: FileText },
  ]

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface border-r border-border flex flex-col">
      {/* Logo e Nome de Usuário */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <img src={logoIcon} alt="Meu Controle Financeiro" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="text-sm font-black text-primary-700 uppercase leading-tight">Meu Controle</h1>
            <p className="text-xs font-bold text-accent-600 uppercase tracking-wide">Financeiro</p>
          </div>
        </div>
        {nomeExibido && (
          <button
            onClick={abrirEdicaoDeNome}
            className="flex items-center gap-1.5 mt-3 text-left group"
            title="Editar nome"
          >
            <p className="text-xs text-text-secondary truncate">
              Olá, <span className="text-text-primary font-medium">{nomeExibido}</span>
            </p>
            <Pencil size={11} className="text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </button>
        )}
      </div>

      {/* Navegação */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 border-l-4 border-l-accent'
                    : 'text-text-secondary border-l-4 border-l-transparent hover:text-text-primary hover:bg-background'
                }`
              }
            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          )
        })}
      </nav>

      {/* Botão Sair */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-text-secondary hover:text-text-primary hover:bg-background border border-border rounded text-sm font-medium transition-colors"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>

      <Modal isOpen={isModalOpen} title="Editar nome" onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleSalvarNome} className="space-y-4">
          <Input
            id="nome"
            label="Nome"
            type="text"
            placeholder="Como podemos te chamar?"
            value={nomeForm}
            onChange={(e) => setNomeForm(e.target.value)}
          />

          {erro && (
            <div className="bg-red-50 border border-negative border-opacity-30 text-negative text-sm p-3 rounded-lg">
              {erro}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Salvar
            </Button>
          </div>
        </form>
      </Modal>
    </aside>
  )
}
