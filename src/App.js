import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login'; // <--- Confira se o 'L' é maiúsculo na pasta também!
import Cadastro from './pages/Cadastro/Cadastro';
import Salarios from './pages/Salarios/Salarios';
import Gastos from './pages/Gastos/Gastos';
import Resumo from './pages/Resumo/Resumo';

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