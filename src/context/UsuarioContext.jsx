import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const UsuarioContext = createContext(null)

/**
 * Busca GET /usuario/me uma única vez e compartilha o resultado (nome, email, modo demo)
 * com toda a árvore dentro do Layout — antes disso, Sidebar e cada página que precisasse
 * saber se é a conta demo fariam a mesma chamada de novo.
 */
export function UsuarioProvider({ children }) {
  const [usuario, setUsuario] = useState(null)

  const buscarUsuario = async () => {
    try {
      const response = await api.get('/usuario/me')
      setUsuario(response.data)
    } catch {
      // Sem bloqueio: o resto da tela funciona normalmente mesmo se isso falhar
    }
  }

  useEffect(() => {
    buscarUsuario()
  }, [])

  return (
    <UsuarioContext.Provider value={{ usuario, recarregarUsuario: buscarUsuario }}>
      {children}
    </UsuarioContext.Provider>
  )
}

export function useUsuario() {
  return useContext(UsuarioContext)
}
