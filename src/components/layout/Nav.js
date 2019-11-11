import React, {useContext} from 'react';
import {Link} from 'react-router-dom';
import { CRMContext } from '../../context/CRMContext';

const Nav = () => {

    const [auth] = useContext(CRMContext);
    if(!auth.auth) return null;
    
    return (
        <aside className="sidebar col-3">
            <h2>Administración</h2>

            <nav className="navegacion">
                <Link to={"/"} className="clientes">Clientes</Link>
                <Link to={"/category"} className="categorias">Categorias</Link>
                <Link to={"/product"} className="productos">Productos</Link>
                <Link to={"/shoppingCart"} className="pedidos">Pedidos</Link>
            </nav>
        </aside>
    );
}

export default Nav;