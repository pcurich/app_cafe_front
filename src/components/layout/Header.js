import React, {useContext} from 'react';

import { CRMContext } from '../../context/CRMContext';
import {withRouter} from 'react-router-dom';

const Header = (props) => {

    const [auth, saveAuth] = useContext(CRMContext);

    const logout = () => {
        // auth.auth = false y el token se remueve
        saveAuth({
            token: '',
            auth: false
        });

        localStorage.clear();

        // redireccionar
        props.history.push('/login');
    }

    return (
        <header className="barra">
            <div className="contenedor">
                <div className="contenido-barra">
                    <h1>CRM - Administrador de Clientes</h1>


                    { auth.auth ? (
                        <button 
                            type="button"
                            className="btn btn-rojo"
                            onClick={logout}
                        >
                            <i className="far fa-times-circle"></i>
                            Cerrar Sesión
                        </button>
                    ) : null }
                    
                
                </div>
                
            </div>
        </header>
    )

}

export default withRouter(Header);