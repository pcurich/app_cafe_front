import React, {Fragment, useState,useContext, useEffect} from 'react';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';
import axios from '../../../config/axios';

function CreateUser(props){
    
    const[user, setUser] = useState({name:'', email: '', password:''});

    const readData = e => {
        setUser({
            ...user,
            [e.target.name] : e.target.value
        })
    }

    const responseBG = res => {
        //check for monngo errors
        if(res.status === 200){
            Swal.fire(
                `${'Se creo el usuario'}`,
                res.data.message,
                'success'
            )         
        }else{
            Swal.fire({
                type:'error',
                title:'Hubo un error',
                text:res
            })
        }
    }

    const createUser = async e => {
        e.preventDefault();

        const headers = {
            'Content-Type': 'application/json' 
        }

        let formData = new FormData();
        formData.append('name',user.name);
        formData.append('email',user.email);
        formData.append('password',user.password); 

        var object = {};
        formData.forEach(function(value, key){
            object[key] = value;
        });
        var json = JSON.stringify(object);

        try {
            await axios.post('/create-account',json,{ headers: headers })
                .then(res => {
                    responseBG(res);
                    props.history.push('/login');
            })
        } catch (error) {
            Swal.fire({
                type:'error',
                title:'Hubo un error',
                text:error
            })
        }
    }

    return(
        <Fragment>
            <h2>Nuevo usuario</h2>

            <div className="contenedor-formulario">
                <form onSubmit={createUser} >
                    <div className="campo">
                        <label>Nombre Completo</label>
                        <input 
                            type="text"
                            name="name"
                            placeholder="Nombre y apellidos"
                            required
                            onChange={readData}
                            // value = "1@1.com"
                        />
                    </div>

                    <div className="campo">
                        <label>Email</label>
                        <input 
                            type="text"
                            name="email"
                            placeholder="Email"
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

                    <input type="submit" value="Guardar" className="btn btn-verde btn-block" />
                </form>
            </div>
        </Fragment>
    )
}
export default withRouter(CreateUser);