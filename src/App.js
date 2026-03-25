import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login.jsx'; 
import Cadastro from './pages/Cadastro/Cadastro.jsx';
import Salarios from './pages/Salarios/Salarios.jsx';
import Gastos from './pages/Gastos/Gastos.jsx';
import Resumo from './pages/Resumo/Resumo.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Usando o "*" garantimos que qualquer erro de rota caia no Login */}
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Login />} /> 
        
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/salarios" element={<Salarios />} />
        <Route path="/gastos" element={<Gastos />} />
        <Route path="/resumo" element={<Resumo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;