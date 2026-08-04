import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Menu, Eye } from 'lucide-react'
import Sidebar from './Sidebar'
import { UsuarioProvider, useUsuario } from '../context/UsuarioContext'

function BannerDemo() {
  const { usuario } = useUsuario()
  if (!usuario?.demo) return null

  return (
    <div className="mb-4 flex items-center gap-2 rounded-lg border border-accent-600 border-opacity-30 bg-accent-50 px-4 py-2.5 text-sm text-accent-800">
      <Eye size={16} className="flex-shrink-0" />
      Você está no modo demo — dados de exemplo, somente leitura.
    </div>
  )
}

function LayoutInterno() {
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
    }
  }, [navigate])

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 md:ml-64 overflow-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <button
            className="md:hidden mb-4 p-2 rounded-lg hover:bg-surface border border-border"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>
          <BannerDemo />
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default function Layout() {
  return (
    <UsuarioProvider>
      <LayoutInterno />
    </UsuarioProvider>
  )
}
