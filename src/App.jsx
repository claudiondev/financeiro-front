import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login/Login.jsx'
import Cadastro from './pages/Cadastro/Cadastro.jsx'
import Layout from './components/Layout.jsx'
import Resumo from './pages/Resumo/Resumo.jsx'
import Gastos from './pages/Gastos/Gastos.jsx'
import Salarios from './pages/Salarios/Salarios.jsx'
import ContasFixas from './pages/ContasFixas/ContasFixas.jsx'
import Relatorios from './pages/Relatorios/Relatorios.jsx'
import Metas from './pages/Metas/Metas.jsx'
import Evolucao from './pages/Evolucao/Evolucao.jsx'
import Assistente from './pages/Assistente/Assistente.jsx'
import Importacao from './pages/Importacao/Importacao.jsx'
import Poupanca from './pages/Poupanca/Poupanca.jsx'

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
          <Route path="/contas-fixas" element={<ContasFixas />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/metas" element={<Metas />} />
          <Route path="/evolucao" element={<Evolucao />} />
          <Route path="/assistente" element={<Assistente />} />
          <Route path="/importar" element={<Importacao />} />
          <Route path="/poupanca" element={<Poupanca />} />
        </Route>

        <Route path="/" element={<Navigate to="/resumo" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
