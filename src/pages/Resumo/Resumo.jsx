import { useState, useEffect } from "react";

import axios from "axios";

import { Link, useNavigate } from 'react-router-dom'; 

function Resumo() {
    const [resumo, setResumo] = useState(null);
    const navigate = useNavigate();
    
    function buscarResumo() {
        const token = localStorage.getItem('token');
        axios.get("http://localhost:8080/gastos/resumo", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setResumo(response.data);
        })
        .catch(error => {
            console.error('Erro ao buscar resumo:', error);
        })
    }

    useEffect(() => {
        buscarResumo();
    }, []);

    if (!resumo) return <p>Carregando...</p>;

    return (
        <div>
            <h1>Resumo</h1>
            <p>Total Salário: {resumo.totalSalario}</p>
            <p>Total Gastos: {resumo.totalGasto}</p>
            <p>Saldo: {resumo.saldo}</p>
            <p>{resumo.mensagem}</p>

        <button type="button" onClick={() => navigate('/gastos')}>Adicionar novo gasto</button>   
        <button type="button" onClick={() => navigate('/salarios')}>Salario</button>   


            
        </div>
    )
}

export default Resumo;