import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut, Home, Wallet, BarChart3, FileText, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'

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
    { name: 'Relatórios', path: '/relatorios', icon: FileText },
  ]

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#111827] border-r border-[#374151] flex flex-col">
      {/* Logo e Nome de Usuário */}
      <div className="p-6 border-b border-[#374151]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-[#10B981] flex items-center justify-center">
            <Wallet size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#F9FAFB]">Meu Controle</h1>
            <p className="text-xs text-[#6B7280]">Financeiro</p>
          </div>
        </div>
        {userName && (
          <p className="text-xs text-[#6B7280] mt-3 truncate">
            Olá, <span className="text-[#F9FAFB] font-medium">{userName}</span>
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
                    ? 'bg-[#1F2937] text-[#F9FAFB] border-l-4 border-l-[#10B981]'
                    : 'text-[#6B7280] border-l-4 border-l-transparent hover:text-[#F9FAFB]'
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
      <div className="p-4 border-t border-[#374151]">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-[#6B7280] hover:text-[#F9FAFB] hover:bg-[#1F2937] border border-[#374151] rounded text-sm font-medium transition-colors"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  )
}
