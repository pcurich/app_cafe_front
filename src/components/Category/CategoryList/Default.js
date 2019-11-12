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
        console.log(auth.token);
        if(auth.token === '') props.history.push('/login');

        let isSubscribed = true;
        const API = async () => {
            if (isSubscribed) {
                try {
                    await axios.get(PATH, { 
                        headers: { 
                            Authorization : `Bearer ${auth.token}`
                        }
                    })
                    .then(bg=>isSubscribed ? save(bg.data) : null)
                } catch (err) {
                    if(err.response.status === 500) {
                        props.history.push('/login');
                    }
                }
            }
        }
        API();
        return () => (isSubscribed = false);
    },[auth.token,  props.history]);

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