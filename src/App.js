import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";  
import Cadastro from "./pages/Cadastro/Cadastro";
import Gastos from "./pages/Gastos/Gastos";
import Salario from "./pages/Salarios/Salarios";
import Resumo from "./pages/Resumo/Resumo";



function App() {
  const token = localStorage.getItem('token');
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro/>} />
        <Route path="/gastos" element={<Gastos />} />
        <Route path="/salarios" element={<Salario/>} />
        <Route path="/resumo" element={<Resumo/>}  />
      </Routes>
    </BrowserRouter>
  );
}
export default App;