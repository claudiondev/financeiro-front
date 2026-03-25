import { useState, useEffect } from "react";
import api from "../../services/api"; // Usando sua configuração centralizada
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png'; 

function Salario() {
    const [valor, setValor] = useState("");
    const [comissao, setComissao] = useState("");
    const [adicional, setAdicional] = useState("");
    const [descricao, setDescricao] = useState("");
    const [data, setData] = useState("");
    const [listaSalarios, setListaSalarios] = useState([]); 
    const navigate = useNavigate();

    // 1. BUSCAR SALÁRIOS
    const buscarSalarios = async () => {
        try {
            const response = await api.get('/salario');
            setListaSalarios(response.data);
        } catch (error) {
            console.error('Erro ao buscar:', error);
            // Se o token falhar, volta para o login
            if (error.response && (error.response.status === 403 || error.response.status === 401)) {
                navigate('/login');
            }
        }
    };

    useEffect(() => { 
        const token = localStorage.getItem('token');
        if (!token || token === "null") {
            navigate('/login');
        } else {
            buscarSalarios(); 
        }
    }, []);

    // 2. SALVAR SALÁRIO
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/salario', {
                valor, comissao, adicional, descricao, data
            });
            buscarSalarios();
            setValor(""); setComissao(""); setAdicional(""); setDescricao(""); setData("");
        } catch (error) {
            console.error('Erro ao adicionar:', error);
        }
    };

    // 3. DELETAR SALÁRIO
    const deletarSalario = async (id) => {
        if (!window.confirm("Tem certeza que deseja apagar este salário?")) return;

        try {
            await api.delete(`/salario/${id}`);
            buscarSalarios();
        } catch (error) {
            console.error('Erro ao deletar:', error);
        }
    };

    return (
        <div className="min-h-screen bg-brand-dark text-brand-text-main font-sans">
            
            <header className="bg-brand-card border-b border-neutral-800 p-4 shadow-md">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <img src={logo} alt="Logo" className="w-24 h-auto" />
                        <div className="h-6 w-[1px] bg-neutral-700 hidden sm:block"></div>
                        <span className="text-lg font-bold tracking-tight text-brand-text-main hidden sm:block">Salário</span>
                    </div>
                    <nav className="flex gap-5">
                        <button onClick={() => navigate('/gastos')} className="text-sm text-brand-blue hover:brightness-125 font-bold transition-all uppercase tracking-wider">Gastos</button>
                        <button onClick={() => navigate('/resumo')} className="text-sm text-brand-blue hover:brightness-125 font-bold transition-all uppercase tracking-wider">Resumo</button>
                    </nav>
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <section className="lg:col-span-1">
                    <div className="bg-brand-card p-6 rounded-2xl border border-neutral-800 shadow-lg">
                        <h2 className="text-sm font-bold mb-5 text-brand-blue uppercase tracking-widest">Nova Entrada</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-bold text-brand-text-sub uppercase mb-1 block">Valor Principal</label>
                                <input type="number" value={valor} onChange={(e) => setValor(e.target.value)} className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-sm focus:border-brand-blue outline-none transition-all" placeholder="0,00" required />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] font-bold text-brand-text-sub uppercase mb-1 block">Comissão</label>
                                    <input type="number" value={comissao} onChange={(e) => setComissao(e.target.value)} className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-sm focus:border-brand-blue outline-none" placeholder="0,00" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-brand-text-sub uppercase mb-1 block">Adicional</label>
                                    <input type="number" value={adicional} onChange={(e) => setAdicional(e.target.value)} className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-sm focus:border-brand-blue outline-none" placeholder="0,00" />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-brand-text-sub uppercase mb-1 block">Descrição</label>
                                <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-sm focus:border-brand-blue outline-none" placeholder="Ex: Salário Semanal" />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-brand-text-sub uppercase mb-1 block">Data</label>
                                <input type="date" value={data} onChange={(e) => setData(e.target.value)} className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-2.5 text-sm focus:border-brand-blue outline-none" style={{colorScheme: 'dark'}} required />
                            </div>

                            <button type="submit" className="w-full bg-brand-blue hover:bg-blue-600 text-white font-bold py-3 rounded-xl mt-2 transition-all shadow-md uppercase text-xs tracking-widest">
                                Salvar
                            </button>
                        </form>
                    </div>
                </section>

                <section className="lg:col-span-2">
                    <div className="bg-brand-card rounded-2xl border border-neutral-800 shadow-lg overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-neutral-900/50 text-brand-text-main text-[11px] uppercase font-bold">
                                <tr>
                                    <th className="px-5 py-3">Data</th>
                                    <th className="px-5 py-3">Descrição</th>
                                    <th className="px-5 py-3">Total (R$)</th>
                                    <th className="px-5 py-3 text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800">
                                {listaSalarios.map((s) => (
                                    <tr key={s.id} className="hover:bg-neutral-800/30 transition-colors">
                                        <td className="px-5 py-3 text-brand-text-sub text-xs">{s.data}</td>
                                        <td className="px-5 py-3 font-medium">{s.descricao || 'Entrada'}</td>
                                        <td className="px-5 py-3">
                                            <span className="text-green-400 font-bold">
                                                {(Number(s.valor || 0) + Number(s.comissao || 0) + Number(s.adicional || 0)).toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-center">
                                            <button onClick={() => deletarSalario(s.id)} className="text-red-500 hover:text-red-400 px-2 py-1 rounded transition-all text-xs font-bold uppercase tracking-tighter">
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

export default Salario;