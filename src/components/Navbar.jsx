import { Link } from 'react-router-dom';

function Navbar () {
   return (
    <nav>  
<Link to="/salarios">Salários</Link>
<Link to="/gastos">Gastos</Link>
<Link to="/resumo">Resumo</Link>
   </nav>
)

}
export default Navbar