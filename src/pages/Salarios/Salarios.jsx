import { useState, useEffect,} from "react";

import axios from "axios";

import { Link, useNavigate } from 'react-router-dom'; 


function Salario (){
    const [valor, setValor] = useState("");
    const [comissao, setComissao] = useState("");
    const [adicional, setAdicional] = useState("");
    const [descricao, setDescricao] = useState("");
    const [data, setData] = useState("");
    const [salario, setSalario] = useState ([]);
    const navigate = useNavigate();


function buscarSalarios() {
   const token = localStorage.getItem('token');
   axios.get('http://localhost:8080/salario', {
    headers: {
        Authorization: `Bearer ${token}`
    }
   })
   .then(response => {
     setSalario(response.data);

   })
   .catch (error => {
        console.error ('Erro ao adicionar salario:', error);
   })
   }

    useEffect(() => {
       buscarSalarios();
    }, []);

    
    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        axios.post ('http://localhost:8080/salario',{
            valor,
            comissao,
            adicional,
            descricao,
            data
        }, {headers:{
            Authorization: `Bearer ${token}`
        }})

        .then(responde => {
            console.log('Salario adicionado com sucesso:', responde.data);
            buscarSalarios();
            setValor("");
            setComissao("");
            setAdicional("");
            setDescricao("");
            setData("");

        })
        .catch(error => {
            console.log('Erro ao adicionar Salario:', error);
        })}

    const deletarSalario = (id) => {
            const token = localStorage.getItem('token');

            axios.delete(`http://localhost:8080/salario/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
        })
        .then(response => {
         buscarSalarios();
        })
         .catch(error => {
         console.error('Erro ao deletar salario:', error);
         })
}  // fecha o deletarSalario

    return (
       <div>
        <h1>Salario</h1>
        <form onSubmit={handleSubmit}>
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
             htmlFor="comissao"
                >
            Comissao:
            </label>
            <input
            type="number"
            id="comissao" value={comissao} onChange={(e) => setComissao(e.target.value)}
                
                />
            <label
             htmlFor="adicional"
                >
             Adicional:
            </label>
            <input
            type="number"
            id="adicional" value={adicional} onChange={(e) => setAdicional(e.target.value)}
            />

            <label
            htmlFor="descricao"
            >
            Descricao:
            </label>
            <input
            type="text"
            id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)}
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
         <button type="submit">Adicionar Salario</button>
        </form>

            <table>
                <thead>
                    <tr>
                        <th>Valor</th>
                        <th>Comissão</th>
                        <th>Adicional</th>
                        <th>Descrição</th>
                        <th>Data</th>
                    </tr>
                </thead>
                <tbody>
                    {salario.map((salario) => (
                        <tr key={salario.id}>
                            <td>{salario.valor}</td>
                            <td>{salario.comissao}</td>
                            <td>{salario.adicional}</td>
                            <td>{salario.descricao}</td>
                            <td>{salario.data}</td>
                            <td><button onClick= {()=> deletarSalario(salario.id)}>
                                 Excluir
                                 </button></td>
                        </tr>
                    ))}
                </tbody>
            </table>

        <button type="button" onClick={() => navigate('/gastos')}>Gastos</button>   

       </div>

       

    )

}
export default Salario;