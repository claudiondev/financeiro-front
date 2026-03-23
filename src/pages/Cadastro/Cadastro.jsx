import { useState } from "react";

import axios from "axios";

import { Link, useNavigate,} from "react-router-dom";



function Cadastro() {
    const [usuario, setUsuario] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [repetirSenha, setRepetirSenha] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
      e.preventDefault();
      if (senha !== repetirSenha) {
        console.error('As senhas não coincidem');
        return; 
      }
      axios.post('http://localhost:8080/auth/registrar', { email, senha, usuario, repetirSenha })
        .then(response => {
          console.log('Cadastro bem-sucedido:', response.data);
          navigate('/login')
          
        })
       .catch(error => {
        console.error('Erro ao fazer cadastro:', error);
        // Aqui você pode exibir uma mensagem de erro para o usuário
      }) };

  return (
    <div>
      <h1>Cadastro</h1>
        <form  onSubmit={handleSubmit}>
          <div>
            <label htmlFor="usuario">Nome:</label>
            <input type="text" id="usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label htmlFor="senha">Senha:</label>
            <input type="password" id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
          </div>
            <div>
            <label htmlFor="repetirSenha">Repita a Senha:</label>
            <input type="password" id="repetirSenha" value={repetirSenha} onChange={(e) => setRepetirSenha(e.target.value)} />
          </div>
          <button type="submit">
            Cadastrar
          </button>
        </form>
        <Link to="/login">Já tem uma conta? Faça login</Link>  
    </div>
  );
}

export default Cadastro;