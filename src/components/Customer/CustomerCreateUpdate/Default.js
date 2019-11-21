import React,{Fragment, useState,useContext, useEffect} from 'react';
import Swal from 'sweetalert2';
import {withRouter} from 'react-router-dom';
import axios from '../../../config/axios';

// import el Context
import { CRMContext } from '../../../context/CRMContext';

function NewCustomer(props){

    //obtengo el id para saber si es un updae o un new
    const {id} = props.match.params;

    // utilizar valores del context
    const [auth ] = useContext( CRMContext );

    //customer =state, save = function to save the stata
    const[customer, save] = useState({ name:'', last_name:'', company:'', email:'', phone: '',document_value:'' });

    const updateStete = e => {
        save({
            ...customer,
            [e.target.name]: e.target.value
        })
    }

    //validate form
    const validate =()=> {
        const {name,last_name,company,email,document_value} = customer;
        let is_valid = !name.length || !last_name.length|| !company.length|| !email.length || !document_value.length;
        return is_valid;
    }

    const responseBG = res => {
        //check for monngo errors
        if(res.data.code === 11000){
            Swal.fire({
                type:'error',
                title:'Hubo un error',
                text:'Ese cliente ya esta registrado'
            })
        }else{
            Swal.fire(
                `${id ? 'Se actualizo el cliente': 'Se agregó el cliente'}`,
                res.data.message,
                'success'
            )
        }
    }

    //add a new customer
    const addCustomer = e => {
        e.preventDefault();
		const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`
        }

        if(id){
            //Update
            axios
            .put(`/customers/${id}`,customer,{ headers: headers })
            .then(res => {
                responseBG(res);
                props.history.push('/customer');
            })
        }else{
            //Insert
            axios
            .post('/customers', customer,{ headers: headers })
            .then(res => {
                responseBG(res);
                props.history.push('/customer');
            })
        }
    }

    //useEffect, cuando el componente carga
    useEffect(()=>{

        if(!auth.auth && (localStorage.getItem('token')===auth.token)) {
            return props.history.push('/login')
        };

        if(id){
            //Query a la API
            const API = async () => {
                await axios.get(`/customers/${id}`,{
                    headers: {
                        Authorization : `Bearer ${auth.token}`
                    }
                })
                .then(bg=> {
                    save(bg.data)
                });
            }
            API()
        };
        return () => {};
    },[auth.auth, auth.token, id, props.history]);

    //verifica si el usuario esta autenticado o no
    if(!auth.auth && (localStorage.getItem('token')===auth.token)) {
        return props.history.push('/login')
    };


    return (
        <Fragment>
            {id ? <h2>Editar Cliente</h2> : <h2>Nuevo Cliente</h2> }

            <form onSubmit={addCustomer} >
                { id ?
                    <legend>Actualize los campos</legend> :
                    <legend>Llena todos los campos</legend>
                }

                <div className="campo">
                    <label>Dni:</label>
                    <input  type="text"
                            placeholder="DNI"
                            name="document_value"
                            value= {customer.document_value}
                            onChange={updateStete}
                    />
                </div>

                <div className="campo">
                    <label>Nombre:</label>
                    <input  type="text"
                            placeholder="Nombre Cliente"
                            name="name"
                            value= {customer.name}
                            onChange={updateStete}
                    />
                </div>

                <div className="campo">
                    <label>Apellido:</label>
                    <input  type="text"
                            placeholder="Apellido Cliente"
                            name="last_name"
                            value= {customer.last_name}
                            onChange={updateStete}
                    />
                </div>

                <div className="campo">
                    <label>Empresa:</label>
                    <input  type="text"
                            placeholder="Empresa Cliente"
                            name="company"
                            value= {customer.company}
                            onChange={updateStete}
                    />
                </div>

                <div className="campo">
                    <label>Email:</label>
                    <input  type="email"
                            placeholder="Email Cliente"
                            name="email"
                            value= {customer.email}
                            onChange={updateStete}
                    />
                </div>

                <div className="campo">
                    <label>Teléfono:</label>
                    <input  type="tel"
                            placeholder="Teléfono Cliente"
                            name="phone"
                            value= {customer.phone}
                            onChange={updateStete}
                    />
                </div>

                <div className="enviar">
                    <input  type="submit"
                            className="btn btn-azul"
                            value= {id ? "Guardar Cambios" :"Agregar Cliente" }
                            disabled = {validate()}
                    />
                </div>

            </form>
        </Fragment>
    );
}

// HOC, es una funcion que toma un componente y retorna un nuevo componenete
export default withRouter(NewCustomer);

