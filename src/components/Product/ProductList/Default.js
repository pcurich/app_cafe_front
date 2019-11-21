import React,{useEffect, useState, useContext, Fragment} from 'react';
import axios from '../../../config/axios';
import {Link,withRouter} from 'react-router-dom'

import Product from '../ProductBlock/Default'

// import el Context
import { CRMContext } from '../../../context/CRMContext';

function Products(props) {
    //work with state
    //products = state, save = save state
    const[products, save]= useState([]);

    // utilizar valores del context
    const [auth ] = useContext( CRMContext );

    //useEffect para consultar api cuando cargue
    useEffect( () =>  {
        let isSubscribed = true;
        if(!auth.auth && (localStorage.getItem('token')===auth.token)) {
            return props.history.push('/login')
        };

        //Query a la API
        const API = async () => {
            try {
                await axios.get('/products', {
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
    },[auth.auth, auth.token, props.history]);

    // Si el state esta como false
    if(!auth.auth && (localStorage.getItem('token')===auth.token)) {
        return props.history.push('/login')
    };

    return (
        <Fragment>
            <h2>Productos</h2>

            <Link to={'/product/new'} className="btn btn-verde nvo-cliente">
                <i className="fas fa-plus-circle"></i>
                Nuevo Producto
            </Link>

            <ul className="listado-productos">
            {
                products.map(product=>(
                    <Product
                    key={product._id}
                    product={product}
                    />)
                )
            }
            </ul>
        </Fragment>

    )
}

export default withRouter(Products);