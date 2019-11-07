import React,{useEffect, useState, Fragment} from 'react';
import axios from '../../config/axios';
import {Link} from 'react-router-dom'

import Product from '../ProductBlock/Default'
import Spinner from '../layout/Spinner';

function Products() {

    //work with state
    //products = state, save = save state
    const[products, save]= useState([]);

    //useEffect para consultar api cuando cargue
    useEffect( () => {
        //Query a la API
        const API = async () => {
            const bg = await axios.get('/products');
            save(bg.data)
        }
        API();
    },[products]);

    //Spinner de carga
    if(!products) return <Spinner />
    

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

export default Products;