import { useState, useEffect } from "react";

import axios from "axios";

function Gastos(){
    const [categoria, setCategoria] = useState("");
    const [valor, setValor] = useState("");
    const [data, setData] = useState("");
    const [descricao, setDescricao] = useState("");
    const [gastos, setGastos] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:8080/gastos', {
    headers: {
        Authorization: `Bearer ${token}`
    }
})
            .then(response => {
                setGastos(response.data);
            })
            .catch(error => {
                console.error('Erro ao buscar gastos:', error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        axios.post ('http://localhost:8080/gastos', {
            categoria,
            valor,
            data,
            descricao

        }, {headers: {
            Authorization: `Bearer ${token}`
        }})

        .then(responde => {
            console.log('Gasto adicionado com sucesso:', responde.data);
        })
        .catch(error => {
            console.error('Erro ao adicionar gasto:', error);
        });

    }

    return (
        <div>
            <h1>Gastos</h1>
            <form onSubmit={handleSubmit}>
                <label
                 htmlFor="categoria"
                >
                    Categoria:
                </label>
                <input
                 type="text"
                 id="categoria" value={categoria} onChange={(e) => setCategoria(e.target.value)}

                />
                <label
                 htmlFor="valor"
                >
                    Valor:
                </label>
                <input
                 type="number"
                 id="valor" value={valor} onChange={(e) => setValor(e.target.value)}
                />
                <label
                 htmlFor="data"
                >
                    Data:
                </label>
                <input
                 type="date"
                 id="data" value={data} onChange={(e) => setData(e.target.value)}
                />
                <label
                 htmlFor="descricao"
                >
                    Descrição:
                </label>
                <input
                 type="text"
                 id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)}
                />
                <button type="submit">Adicionar Gasto</button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th>Categoria</th>
                        <th>Valor</th>
                        <th>Data</th>
                        <th>Descrição</th>
                    </tr>
                </thead>
                <tbody>
                    {gastos.map((gasto) => (
                        <tr key={gasto.id}>
                            <td>{gasto.categoria}</td>
                            <td>{gasto.valor}</td>
                            <td>{gasto.data}</td>
                            <td>{gasto.descricao}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )

}

export default Gastos;