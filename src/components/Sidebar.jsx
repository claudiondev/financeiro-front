import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut, Home, Wallet, FileText, Zap, Target, TrendingUp, Repeat, Pencil, X, Lightbulb, Mail } from 'lucide-react'
import { useState } from 'react'
import api, { extrairMensagemErro } from '../services/api'
import Modal from './Modal'
import Input from './ui/Input'
import Button from './ui/Button'
import logoIcon from '../assets/logo-icon.png'
import { useUsuario } from '../context/UsuarioContext'

// lucide-react removeu os ícones de marca (Github/Linkedin) por questão de trademark —
// SVGs inline no lugar de puxar uma lib nova só por 2 ícones.
function IconeGithub(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16} {...props}>
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1-.02-1.96-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.8 1.19 1.83 1.19 3.09 0 4.43-2.7 5.4-5.28 5.69.42.36.79 1.07.79 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.2.66.79.55A10.51 10.51 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
    </svg>
  )
}
function IconeLinkedin(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16} {...props}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.86 0-2.15 1.45-2.15 2.94v5.66H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  )
}

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate()
  const { usuario, recarregarUsuario } = useUsuario()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [nomeForm, setNomeForm] = useState('')
  const [erro, setErro] = useState('')

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
      await api.put('/usuario/perfil', { nome: nomeForm || null })
      await recarregarUsuario()
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
    { name: 'Assistente', path: '/assistente', icon: Lightbulb },
    { name: 'Relatórios', path: '/relatorios', icon: FileText },
  ]

  return (
    <aside className={`fixed left-0 top-0 h-screen w-64 bg-surface border-r border-border flex flex-col z-40 transition-transform duration-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      {/* Logo e Nome de Usuário */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <button className="md:hidden absolute top-4 right-4 text-text-secondary" onClick={onClose}>
            <X size={20} />
          </button>
          <img src={logoIcon} alt="Meu Controle Financeiro" className="w-10 h-10 object-contain" />
          <div>
            <h1 className="text-sm font-black text-primary-700 uppercase leading-tight">Meu Controle</h1>
            <p className="text-xs font-bold text-accent-600 uppercase tracking-wide">Financeiro</p>
          </div>
        </div>
        {nomeExibido && usuario?.demo && (
          <p className="mt-3 text-xs text-text-secondary truncate">
            Olá, <span className="text-text-primary font-medium">{nomeExibido}</span>
          </p>
        )}
        {nomeExibido && !usuario?.demo && (
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
      <nav className="flex-1 min-h-0 overflow-y-auto p-4 space-y-2">
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

        <div className="flex items-center justify-center gap-4 mt-3">
          <a
            href="https://github.com/claudiondev"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
            className="text-text-secondary hover:text-primary transition-colors"
          >
            <IconeGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/claudionascimento-dev"
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn"
            className="text-text-secondary hover:text-primary transition-colors"
          >
            <IconeLinkedin />
          </a>
          <a
            href="mailto:claudiondev@gmail.com"
            title="E-mail"
            className="text-text-secondary hover:text-primary transition-colors"
          >
            <Mail size={16} />
          </a>
        </div>
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
