import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'

export default function Sidebar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const navItems = [
    { name: 'Resumo', path: '/resumo' },
    { name: 'Gastos', path: '/gastos' },
    { name: 'Salário', path: '/salarios' },
    { name: 'Relatórios', path: '/relatorios' },
  ]

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-surface border-r border-border-dark flex flex-col">
      <div className="p-6 border-b border-border-dark">
        <h1 className="text-xl font-bold text-text-primary">Meu Controle Financeiro</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block px-4 py-3 rounded text-sm font-semibold uppercase tracking-wider transition-colors border-l-4 ${
                isActive
                  ? 'bg-accent bg-opacity-10 text-accent border-l-accent'
                  : 'text-text-secondary border-l-transparent hover:bg-surface'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border-dark">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-negative border border-negative rounded text-sm font-semibold uppercase tracking-wider transition-colors hover:bg-negative hover:bg-opacity-10"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  )
}
