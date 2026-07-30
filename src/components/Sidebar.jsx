import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut, Home, Wallet, FileText, Zap, Target } from 'lucide-react'
import { useState, useEffect } from 'react'
import logoIcon from '../assets/logo-icon.png'

export default function Sidebar() {
  const navigate = useNavigate()
  const [userName, setUserName] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('userName')
    if (stored) setUserName(stored)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    navigate('/login')
  }

  const navItems = [
    { name: 'Resumo', path: '/resumo', icon: Home },
    { name: 'Gastos', path: '/gastos', icon: Wallet },
    { name: 'Salário', path: '/salarios', icon: Zap },
    { name: 'Metas', path: '/metas', icon: Target },
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
        {userName && (
          <p className="text-xs text-text-secondary mt-3 truncate">
            Olá, <span className="text-text-primary font-medium">{userName}</span>
          </p>
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
    </aside>
  )
}
