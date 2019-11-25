import React, {useState, useContext} from 'react';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';
import axios from '../../../config/axios';
import {Link} from 'react-router-dom'
// Context
import { CRMContext } from '../../../context/CRMContext';

function Login(props){

    // Auth y token
    const [, saveAuth] = useContext(CRMContext);


    // State con los datos del formulario
    const [ credentials, saveCredentials] = useState({});


    // iniciar sesión en el servidor
    const initSession = async e => {
        e.preventDefault();

        // autenticar al usuario

        try {
            const respuesta = await axios.post('/login', credentials);
            
            // extraer el token y colocarlo en localstorage
            const { token,user } = respuesta.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', user._id);

            // colocarlo en el state
            saveAuth({
                token, 
                auth: true
            })

            // alerta
            Swal.fire(
                'Login Correcto',
                'Has iniciado Sesión',
                'success'
            )

            // redireccionar
            props.history.push('/');

            
        } catch (error) {
            //console.log(error);
            if(error.response){
                Swal.fire({
                    type: 'error',
                    title: 'Hubo un error',
                    text: error.response.data.message
                })
            }else{
                Swal.fire({
                    type: 'error',
                    title: 'Hubo un error',
                    text: 'hubo un error por CORS '
                })
            }
        }
    }

    // almacenar lo que el usuario escribe en el state
    const readData = e => {
        saveCredentials({
            ...credentials,
            [e.target.name] : e.target.value
        })
    }

    return(

        <div className="login">
            <h2>Iniciar Sesión</h2>

            <div className="contenedor-formulario">
                <form
                    onSubmit={initSession}
                >

                    <div className="campo">
                        <label>Email</label>
                        <input 
                            type="text"
                            name="email"
                            placeholder="Email para Iniciar Sesión"
                            required
                            onChange={readData}
                            // value = "1@1.com"
                        />
                    </div>

                    <div className="campo">
                        <label>Password</label>
                        <input 
                            type="password"
                            name="password"
                            placeholder="Password para Iniciar Sesión"
                            required
                            onChange={readData}
                            // value="Admin"
                        />
                    </div>
                    <div>
                        <span className="btn btn-blue">
                            <Link to="/newUser">Crear Cuenta</Link>
                        </span>
                    </div>
                    <input type="submit" value="Iniciar Sesión" className="btn btn-verde btn-block" />
                </form>
            </div>
        </div>
    )
}

export default withRouter(Login);