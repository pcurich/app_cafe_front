import React,{useEffect, useState, useContext, Fragment} from 'react';
import axios from '../../../config/axios';
import Swal from 'sweetalert2';
import {Link, withRouter} from 'react-router-dom'

import { CRMContext } from '../../../context/CRMContext';

import Category from '../CategoryBlock/Default'
import Product from '../../Product/ProductBlock/Default'
 
import FormProduct from '../../Product/ProductSearch/Default'

function CategoryProduct(props) {

  const {_id,category} = props.match.params;
  const [auth ] = useContext( CRMContext );

  const [search, saveSearch] = useState('');
  const [products, saveProducts] = useState([]);

  useEffect(()=>{

    if(!auth.auth && (localStorage.getItem('token')===auth.token)) {
        return props.history.push('/login')
    };

    // if(_id){
    //     Query a la API
    //     const API = async () => {
    //         await axios.get(`/product-by-category/${_id}`,{
    //             headers: {
    //                 Authorization : `Bearer ${auth.token}`
    //             }
    //         })
    //         .then(bg=>{
    //           setCategory(bg.data)
    //         })
    //     }
    //     API();
    // };
    return () => {};
},[auth.token, auth.auth, _id,props.history]);

const searchProduct  = async e => {
  e.preventDefault();

  // obtener los productos de la busqueda
  const bg = await axios.post(`/products/search/${search}`,'',{
    headers: {
      Authorization : `Bearer ${auth.token}`
    }
  }); 
 
  if(bg.data[0]) {

      let res = bg.data[0];
      // agregar la llave "producto" (copia de id)
      res.product = bg.data[0]._id;
      res.quantity = 0;

      // ponerlo en el state
      saveProducts([...products, res]);

  } else {
      // no hay resultados
      Swal.fire({
          type: 'error',
          title: 'No Resultados',
          text: 'No hay resultados'
      })
  }
}

const readSearchData = e => {
  saveSearch( e.target.value );
}

  return (
    <Fragment>
      <div>
        <h2>{`${category}`}</h2>

        <FormProduct
                    searchProduct={searchProduct}
                    readSearchData={readSearchData}
                /> 

          {/* <ul className="resumen">
            {products.map((product, index) => (
                // <FormProduct
                //     key={product.product}
                //     product={product} 
                //     index={index}
                // />
            ))}
          </ul> */}
      
      </div>
    </Fragment>
  )
}

export default withRouter(CategoryProduct);