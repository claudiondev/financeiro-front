import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login/Login.jsx'
import Cadastro from './pages/Cadastro/Cadastro.jsx'
import Layout from './components/Layout.jsx'
import Resumo from './pages/Resumo/Resumo.jsx'
import Gastos from './pages/Gastos/Gastos.jsx'
import Salarios from './pages/Salarios/Salarios.jsx'
import Relatorios from './pages/Relatorios/Relatorios.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        <Route element={<Layout />}>
          <Route path="/resumo" element={<Resumo />} />
          <Route path="/gastos" element={<Gastos />} />
          <Route path="/salarios" element={<Salarios />} />
          <Route path="/relatorios" element={<Relatorios />} />
        </Route>

        <Route path="/" element={<Navigate to="/resumo" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
