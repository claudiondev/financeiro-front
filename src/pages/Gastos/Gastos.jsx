import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png'; 

function Gastos() {
    const [categoria, setCategoria] = useState("");
    const [valor, setValor] = useState("");
    const [data, setData] = useState("");
    const [descricao, setDescricao] = useState("");
    const [gastos, setGastos] = useState([]);
    const navigate = useNavigate();

    const buscarGastos = () => {
        const token = localStorage.getItem('token');
        
        // Trava de segurança para não dar erro de JWT se o token sumir
        if (!token || token === "null") {
            navigate('/login');
            return;
        }

        axios.get('http://localhost:8080/gastos', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setGastos(response.data);
        })
        .catch(error => {
            console.error('Erro ao buscar gastos:', error);
            if (error.response && error.response.status === 403) {
                navigate('/login');
            }
        });
    };

    useEffect(() => {
        buscarGastos();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        
        axios.post('http://localhost:8080/gastos', {
            categoria, valor, data, descricao
        }, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            buscarGastos();
            setCategoria(""); setValor(""); setDescricao(""); setData("");
        })
        .catch(error => {
            console.error('Erro ao adicionar gasto:', error);
        });
    };

    const deletarGastos = (id) => {
        const token = localStorage.getItem('token');
        axios.delete(`http://localhost:8080/gastos/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            buscarGastos();
        })
        .catch(error => {
            console.error('Erro ao deletar gasto:', error);
        });
    };

    return (
        <div className="min-h-screen bg-brand-dark text-brand-text-main font-sans">
            
            {/* HEADER PADRONIZADO */}
            <header className="bg-brand-card border-b border-neutral-800 p-4 shadow-md">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <img src={logo} alt="Logo" className="w-24 h-auto" />
                        <div className="h-6 w-[1px] bg-neutral-700 hidden sm:block"></div>
                        <span className="text-lg font-bold tracking-tight text-brand-text-main hidden sm:block">Gastos</span>
                    </div>
                    <nav className="flex gap-5">
                        {/* Botões em Azul como você pediu */}
                        <button onClick={() => navigate('/salarios')} className="text-sm text-brand-blue hover:brightness-125 font-bold transition-all uppercase tracking-wider">Salário</button>
                        <button onClick={() => navigate('/resumo')} className="text-sm text-brand-blue hover:brightness-125 font-bold transition-all uppercase tracking-wider">Resumo</button>
                    </nav>
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* FORMULÁRIO DE GASTOS */}
                <section className="lg:col-span-1">
                    <div className="bg-brand-card p-6 rounded-2xl border border-neutral-800 shadow-lg">
                        <h2 className="text-sm font-bold mb-5 text-red-400 uppercase tracking-widest">Novo Gasto</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-brand-text-sub uppercase mb-1 block">Categoria</label>
                                <input type="text" value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-sm focus:border-red-400 outline-none transition-all" placeholder="Ex: Aluguel, Luz..." required />
                            </div>
                            
                            <div>
                                <label className="text-[10px] font-bold text-brand-text-sub uppercase mb-1 block">Valor</label>
                                <input type="number" value={valor} onChange={(e) => setValor(e.target.value)} className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-sm focus:border-red-400 outline-none transition-all" placeholder="0,00" required />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-brand-text-sub uppercase mb-1 block">Descrição</label>
                                <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-sm focus:border-red-400 outline-none" placeholder="Detalhes do gasto" />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-brand-text-sub uppercase mb-1 block">Data</label>
                                <input type="date" value={data} onChange={(e) => setData(e.target.value)} className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-sm focus:border-red-400 outline-none" style={{colorScheme: 'dark'}} required />
                            </div>

                            <button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl mt-2 transition-all shadow-md uppercase text-xs tracking-widest">
                                Registrar Gasto
                            </button>
                        </form>
                    </div>
                </section>

                {/* TABELA DE GASTOS */}
                <section className="lg:col-span-2">
                    <div className="bg-brand-card rounded-2xl border border-neutral-800 shadow-lg overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-neutral-900/50 text-brand-text-main text-[11px] uppercase font-bold">
                                <tr>
                                    <th className="px-5 py-3">Data</th>
                                    <th className="px-5 py-3">Categoria</th>
                                    <th className="px-5 py-3">Valor (R$)</th>
                                    <th className="px-5 py-3 text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800">
                                {gastos.map((g) => (
                                    <tr key={g.id} className="hover:bg-neutral-800/30 transition-colors">
                                        <td className="px-5 py-3 text-brand-text-sub text-xs">{g.data}</td>
                                        <td className="px-5 py-3">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{g.categoria}</span>
                                                <span className="text-[10px] text-neutral-500">{g.descricao}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 font-bold text-red-400">
                                            - R$ {Number(g.valor).toFixed(2)}
                                        </td>
                                        <td className="px-5 py-3 text-center">
                                            <button onClick={() => deletarGastos(g.id)} className="text-red-500/80 hover:text-red-500 hover:bg-red-500/5 px-2 py-1 rounded transition-all text-xs font-bold uppercase">
                                                Apagar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Gastos;