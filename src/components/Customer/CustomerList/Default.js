import React,{useEffect, useState, useContext, Fragment} from 'react';
import axios from '../../../config/axios';
import {Link, withRouter} from 'react-router-dom'

import Customer from '../CustomerBlock/Default'
import Spinner from '../../layout/Spinner';

// import el Context
import { CRMContext } from '../../../context/CRMContext';

function Customers(props) {

    //work with state
    //customer = state, save = save state
    const[customers, save]= useState([]);

    // utilizar valores del context
    const [auth ] = useContext( CRMContext );

    //useEffect para consultar api cuando cargue
    useEffect( () => {
        let isSubscribed = true;
        if(auth.token === '') props.history.push('/login');

        //Query a la API
        const API = async () => {
            try {
                await axios.get('/customers', {
                    headers: {
                        Authorization : `Bearer ${auth.token}`
                    }
                }).then(bg=>isSubscribed ? save(bg.data):null);
            } catch (error) {
                 // Error con authorizacion
                if(error.response.status === 500) {
                    props.history.push('/login');
                }
            }
        }
        API();
        return () => (isSubscribed = false);
    },[auth.token, props.history]);

     // Si el state esta como false
    if(!auth.auth) {
        props.history.push('/login');
    }

    //Spinner de carga
    if(!customers.length) return <Spinner />

    return (
        <Fragment>
            <h2>Clientes</h2>
            <Link to={"/customer/new"} className="btn btn-verde nvo-cliente"> <i className="fas fa-plus-circle"></i>
                Nuevo Cliente
            </Link>
            <ul className="listado-clientes">
            {
                customers.map(customer=>(
                    <Customer
                    key={customer._id}
                    customer={customer}
                    />)
                )
            }
            </ul>
        </Fragment>
    )
}

export default withRouter(Customers);