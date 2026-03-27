import api from '../../services/api'; // 1. Trocado o axios pela sua config de api
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErro('');
    
    // 2. Agora usamos 'api.post' e apenas o final da rota '/auth/login'
    api.post('/auth/login', { email, senha })
      .then(response => {
        localStorage.setItem('token', response.data);
        navigate('/salarios');
      })
      .catch(() => {
        setErro('Email ou senha incorretos. Tente novamente.');
      });
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-4 font-sans text-brand-text-main">
      
      <div className="flex flex-col items-center mb-8 text-center text-brand-text-sub">
        <img src={logo} alt="Logo" className="w-56 h-auto mb-3" />
        <p className="text-sm font-light uppercase tracking-widest opacity-80">
           Gerencie suas finanças com sabedoria
        </p>
      </div>

      <div className="bg-brand-card p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-neutral-800/60">
        <div className="mb-6">
          <h2 className="text-xl font-bold">Bem-vindo de volta 👋</h2>
          <p className="text-brand-text-sub text-sm">Faça login para acessar sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-brand-text-sub ml-1 uppercase tracking-wider">Email</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-neutral-800/50 border border-neutral-700 text-brand-text-main text-sm rounded-xl p-3.5 outline-none focus:border-brand-blue transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-brand-text-sub ml-1 uppercase tracking-wider">Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="bg-neutral-800/50 border border-neutral-700 text-brand-text-main text-sm rounded-xl p-3.5 outline-none focus:border-brand-blue transition-all"
              required
            />
          </div>

          {erro && (
            <p className="text-red-500 text-[11px] font-medium bg-red-500/10 p-2.5 rounded-lg border border-red-500/20 text-center">
              {erro}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-brand-blue hover:bg-blue-600 text-white font-bold text-base rounded-xl p-3.5 transition-all mt-2 active:scale-[0.98] shadow-lg shadow-brand-blue/20"
          >
            Entrar
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-brand-text-sub">
          Não tem uma conta?{' '}
          <Link to="/cadastro" className="text-brand-blue font-bold hover:underline underline-offset-4 decoration-2">
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;