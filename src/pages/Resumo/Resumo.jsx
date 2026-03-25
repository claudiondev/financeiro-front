import { useState, useEffect } from "react";
import api from "../../services/api"; // 1. Usando a nossa API configurada
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png'; 

function Resumo() {
    const [resumo, setResumo] = useState(null);
    const navigate = useNavigate();
    
    // FUNÇÃO DE SAIR (LOGOUT)
    const handleLogout = () => {
        localStorage.removeItem('token'); 
        navigate('/login'); 
    };

    // 2. BUSCAR RESUMO (Limpo e sem Headers repetidos)
    const buscarResumo = async () => {
        try {
            const response = await api.get("/gastos/resumo");
            setResumo(response.data);
        } catch (error) {
            console.error('Erro ao buscar resumo:', error);
            // Se o token estiver inválido (403), volta para o login
            if (error.response && error.response.status === 403) {
                navigate('/login');
            }
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || token === "null") {
            navigate('/login');
        } else {
            buscarResumo();
        }
    }, []);

    if (!resumo) return (
        <div className="min-h-screen bg-brand-dark flex items-center justify-center">
            <p className="text-brand-blue font-bold animate-pulse uppercase tracking-widest text-xs">Carregando Dados do Studio...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-brand-dark text-brand-text-main font-sans">
            
            {/* HEADER - Visual mantido 100% */}
            <header className="bg-brand-card border-b border-neutral-800 p-4 shadow-md">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <img src={logo} alt="Logo" className="w-24 h-auto" />
                        <div className="h-6 w-[1px] bg-neutral-700 hidden sm:block"></div>
                        <span className="text-lg font-bold tracking-tight text-brand-text-main hidden sm:block uppercase text-[10px] tracking-[0.3em]">Resumo</span>
                    </div>
                    <nav className="flex gap-5 items-center">
                        <button onClick={() => navigate('/salarios')} className="text-[10px] text-brand-blue hover:brightness-125 font-black transition-all uppercase tracking-wider">Salário</button>
                        <button onClick={() => navigate('/gastos')} className="text-[10px] text-brand-blue hover:brightness-125 font-black transition-all uppercase tracking-wider">Gastos</button>
                        
                        <button 
                            onClick={handleLogout} 
                            className="ml-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-3 py-1.5 rounded-lg border border-red-500/20 transition-all text-[9px] font-black uppercase tracking-[0.2em]"
                        >
                            Sair
                        </button>
                    </nav>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-6 space-y-6">
                
                {/* CARD DE SALDO PRINCIPAL */}
                <section className="bg-brand-card p-10 rounded-3xl border border-neutral-800 shadow-2xl text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-blue to-transparent opacity-30"></div>
                    <h2 className="text-[10px] font-black text-brand-text-sub uppercase tracking-[0.3em] mb-3">Saldo Disponível no Studio</h2>
                    <p className={`text-6xl font-black mb-5 tracking-tighter ${resumo.saldo >= 0 ? 'text-green-400' : 'text-red-500'}`}>
                        R$ {Number(resumo.saldo).toFixed(2)}
                    </p>
                    <div className="inline-block px-5 py-2 bg-neutral-900/80 rounded-full border border-neutral-800 backdrop-blur-sm">
                        <span className="text-[11px] font-bold text-brand-text-sub italic">
                            "{resumo.mensagem}"
                        </span>
                    </div>
                </section>

                {/* GRID DE ENTRADAS E SAÍDAS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-brand-card p-6 rounded-2xl border border-neutral-800 shadow-lg flex items-center justify-between group hover:border-green-400/30 transition-all">
                        <div>
                            <p className="text-[9px] font-black text-brand-text-sub uppercase mb-1 tracking-widest">Total Entradas</p>
                            <p className="text-2xl font-bold text-green-400">R$ {Number(resumo.totalSalario).toFixed(2)}</p>
                        </div>
                        <div className="h-10 w-10 bg-green-400/10 rounded-full flex items-center justify-center border border-green-400/20">
                            <span className="text-green-400 text-lg">↑</span>
                        </div>
                    </div>

                    <div className="bg-brand-card p-6 rounded-2xl border border-neutral-800 shadow-lg flex items-center justify-between group hover:border-red-500/30 transition-all">
                        <div>
                            <p className="text-[9px] font-black text-brand-text-sub uppercase mb-1 tracking-widest">Total Saídas</p>
                            <p className="text-2xl font-bold text-red-500">R$ {Number(resumo.totalGasto).toFixed(2)}</p>
                        </div>
                        <div className="h-10 w-10 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                            <span className="text-red-500 text-lg">↓</span>
                        </div>
                    </div>
                </div>

                {/* BOTÕES DE NAVEGAÇÃO RÁPIDA */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button onClick={() => navigate('/gastos')} className="flex-1 bg-neutral-900 hover:bg-red-500/10 hover:border-red-500/50 text-brand-text-main font-black py-4 rounded-xl border border-neutral-800 transition-all text-[10px] uppercase tracking-[0.2em]">
                        + Registrar Gasto
                    </button>
                    <button onClick={() => navigate('/salarios')} className="flex-1 bg-neutral-900 hover:bg-green-400/10 hover:border-green-400/50 text-brand-text-main font-black py-4 rounded-xl border border-neutral-800 transition-all text-[10px] uppercase tracking-[0.2em]">
                        + Lançar Salário
                    </button>
                </div>

            </main>
        </div>
    );
}

export default Resumo;