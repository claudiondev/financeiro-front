import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png'; 

function Resumo() {
    const [resumo, setResumo] = useState(null);
    const navigate = useNavigate();
    
    const buscarResumo = () => {
        const token = localStorage.getItem('token');
        
        if (!token || token === "null") {
            navigate('/login');
            return;
        }

        axios.get("http://localhost:8080/gastos/resumo", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setResumo(response.data);
        })
        .catch(error => {
            console.error('Erro ao buscar resumo:', error);
            if (error.response && error.response.status === 403) {
                navigate('/login');
            }
        });
    };

    useEffect(() => {
        buscarResumo();
    }, []);

    if (!resumo) return (
        <div className="min-h-screen bg-brand-dark flex items-center justify-center">
            <p className="text-brand-blue font-bold animate-pulse">Carregando dados...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-brand-dark text-brand-text-main font-sans">
            
            {/* HEADER PADRONIZADO */}
            <header className="bg-brand-card border-b border-neutral-800 p-4 shadow-md">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <img src={logo} alt="Logo" className="w-24 h-auto" />
                        <div className="h-6 w-[1px] bg-neutral-700 hidden sm:block"></div>
                        <span className="text-lg font-bold tracking-tight text-brand-text-main hidden sm:block">Resumo</span>
                    </div>
                    <nav className="flex gap-5">
                        <button onClick={() => navigate('/salarios')} className="text-sm text-brand-blue hover:brightness-125 font-bold transition-all uppercase tracking-wider">Salário</button>
                        <button onClick={() => navigate('/gastos')} className="text-sm text-brand-blue hover:brightness-125 font-bold transition-all uppercase tracking-wider">Gastos</button>
                    </nav>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-6 space-y-6">
                
                {/* CARD DE SALDO PRINCIPAL */}
                <section className="bg-brand-card p-8 rounded-3xl border border-neutral-800 shadow-2xl text-center">
                    <h2 className="text-sm font-bold text-brand-text-sub uppercase tracking-[0.2em] mb-2">Saldo Disponível</h2>
                    <p className={`text-5xl font-black mb-4 ${resumo.saldo >= 0 ? 'text-green-400' : 'text-red-500'}`}>
                        R$ {Number(resumo.saldo).toFixed(2)}
                    </p>
                    <div className="inline-block px-4 py-1.5 bg-neutral-900 rounded-full border border-neutral-800">
                        <span className="text-xs font-medium text-brand-text-sub italic">
                            "{resumo.mensagem}"
                        </span>
                    </div>
                </section>

                {/* GRID DE ENTRADAS E SAÍDAS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* TOTAL SALÁRIO */}
                    <div className="bg-brand-card p-6 rounded-2xl border border-neutral-800 shadow-lg flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-brand-text-sub uppercase mb-1">Total Entradas</p>
                            <p className="text-2xl font-bold text-green-400">R$ {Number(resumo.totalSalario).toFixed(2)}</p>
                        </div>
                        <div className="h-12 w-12 bg-green-400/10 rounded-full flex items-center justify-center">
                            <span className="text-green-400 text-xl">↑</span>
                        </div>
                    </div>

                    {/* TOTAL GASTOS */}
                    <div className="bg-brand-card p-6 rounded-2xl border border-neutral-800 shadow-lg flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-brand-text-sub uppercase mb-1">Total Saídas</p>
                            <p className="text-2xl font-bold text-red-500">R$ {Number(resumo.totalGasto).toFixed(2)}</p>
                        </div>
                        <div className="h-12 w-12 bg-red-500/10 rounded-full flex items-center justify-center">
                            <span className="text-red-500 text-xl">↓</span>
                        </div>
                    </div>
                </div>

                {/* BOTÕES DE AÇÃO RÁPIDA */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button 
                        onClick={() => navigate('/gastos')}
                        className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-brand-text-main font-bold py-4 rounded-xl border border-neutral-700 transition-all text-xs uppercase tracking-widest"
                    >
                        + Novo Gasto
                    </button>
                    <button 
                        onClick={() => navigate('/salarios')}
                        className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-brand-text-main font-bold py-4 rounded-xl border border-neutral-700 transition-all text-xs uppercase tracking-widest"
                    >
                        + Novo Salário
                    </button>
                </div>

            </main>
        </div>
    );
}

export default Resumo;