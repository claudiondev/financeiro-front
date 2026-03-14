import axios from 'axios'; 

import { useState } from 'react';

import { Link } from 'react-router-dom'; 



function Login() {

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (e) => {

    e.preventDefault();
    axios.post('http://localhost:8080/auth/login', { email, senha })
      .then(response => {
    console.log('Login bem-sucedido:', response.data);
    localStorage.setItem('token', response.data); 
        // Aqui você pode redirecionar o usuário ou armazenar o token de autenticação
      })
      .catch(error => {
        console.error('Erro ao fazer login:', error);
        // Aqui você pode exibir uma mensagem de erro para o usuário
      });
  };

  return (
    <div>
      <h1>Entrar</h1>
      <form>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor="senha">Senha:</label>
          <input type="password" id="senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
        </div>
        <button type="submit" onClick={handleSubmit}>
          Entrar
        </button>
      </form>
        <Link to="/cadastro">Não tem uma conta? Cadastre-se</Link>
    </div>
  );
}

export default Login;