import React,{useEffect, useState, useContext, Fragment} from 'react';
import axios from '../../../config/axios';
import {Link, withRouter} from 'react-router-dom'
import Category from '../CategoryBlock/Default'

// import el Context
import { CRMContext } from '../../../context/CRMContext';

function Categories(props) {

    const PATH = '/categories';
    const[categories, save]= useState([]);
    const [auth ] = useContext( CRMContext );

    useEffect( () => {

        if(!auth.auth && (localStorage.getItem('token')===auth.token)) {
            return props.history.push('/login')
        };

        const API = async () => {
            try {
                await axios.get(PATH, {
                    headers: {
                        Authorization : `Bearer ${auth.token}`
                    }
                })
                .then(bg=> {
                    save(bg.data)
                })
            } catch (err) {
                if(err.response.status === 500) {
                    props.history.push('/login');
                }
            }
        }
        API();
        return () => {};
    },[auth.token,auth.auth, props.history]);

    if(!auth.auth) {
        props.history.push('/login');
    }

    return (
        <Fragment>
            <h2>Categorias</h2>
            <Link to={"category/new"} className="btn btn-verde nvo-cliente"> <i className="fas fa-plus-circle"></i>
                Nueva categoria
            </Link>
            <ul className="listado-categorias">
            {
                categories.map(category=>(
                    <Category
                    key={category._id}
                    category={category}
                    />)
                )
            }
            </ul>
        </Fragment>
    )
}

export default withRouter(Categories);