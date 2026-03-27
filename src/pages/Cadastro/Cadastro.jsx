import { useState } from "react";
import api from '../../services/api'; // 1. Trocado o axios pela sua config de api
import { Link, useNavigate } from "react-router-dom";
import logo from '../../assets/logo.png'; 

function Cadastro() {
    const [usuario, setUsuario] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [repetirSenha, setRepetirSenha] = useState("");
    const [erro, setErro] = useState(""); 
    const navigate = useNavigate();

    const handleSubmit = (e) => {
      e.preventDefault();
      setErro("");

      if (senha !== repetirSenha) {
        setErro('As senhas não coincidem');
        return; 
      }

      // 2. Agora usamos 'api.post' e apenas o final da rota '/auth/registrar'
      api.post('/auth/registrar', { email, senha, usuario, repetirSenha })
        .then(response => {
          navigate('/login');
        })
       .catch(error => {
        setErro('Erro ao realizar cadastro. Tente novamente.');
      });
    };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-4 font-sans text-brand-text-main">
      
      <div className="flex flex-col items-center mb-8 text-center text-brand-text-sub">
        <img src={logo} alt="Logo" className="w-56 h-auto mb-3" />
        <p className="text-sm font-light uppercase tracking-widest opacity-80">
           Crie sua conta gratuita
        </p>
      </div>

      <div className="bg-brand-card p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-neutral-800/60">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold">Comece agora 🚀</h2>
          <p className="text-brand-text-sub text-sm">Preencha os dados abaixo</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-brand-text-sub ml-1 uppercase tracking-wider">Nome</label>
            <input
              type="text"
              placeholder="Seu nome completo"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="bg-neutral-800/50 border border-neutral-700 text-brand-text-main text-sm rounded-xl p-3 outline-none focus:border-brand-blue transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-brand-text-sub ml-1 uppercase tracking-wider">Email</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-neutral-800/50 border border-neutral-700 text-brand-text-main text-sm rounded-xl p-3 outline-none focus:border-brand-blue transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-brand-text-sub ml-1 uppercase tracking-wider">Senha</label>
            <input
              type="password"
              placeholder="Crie uma senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="bg-neutral-800/50 border border-neutral-700 text-brand-text-main text-sm rounded-xl p-3 outline-none focus:border-brand-blue transition-all"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-brand-text-sub ml-1 uppercase tracking-wider">Confirmar Senha</label>
            <input
              type="password"
              placeholder="Repita a senha"
              value={repetirSenha}
              onChange={(e) => setRepetirSenha(e.target.value)}
              className="bg-neutral-800/50 border border-neutral-700 text-brand-text-main text-sm rounded-xl p-3 outline-none focus:border-brand-blue transition-all"
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
            className="w-full bg-brand-blue hover:bg-blue-600 text-white font-bold text-base rounded-xl p-3.5 transition-all mt-4 active:scale-[0.98] shadow-lg shadow-brand-blue/20"
          >
            Finalizar Cadastro
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-brand-text-sub">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-brand-blue font-bold hover:underline underline-offset-4 decoration-2">
            Fazer login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;