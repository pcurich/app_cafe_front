import React,{useEffect, useState, useContext, Fragment} from 'react';
import axios from '../../../config/axios';
import Swal from 'sweetalert2';
import {withRouter} from 'react-router-dom'

import { CRMContext } from '../../../context/CRMContext';

import ProductSearchResult from '../../Product/ProductSearchResult/Default';
import ProductSearch from '../../Product/ProductSearch/Default';
import ProductInCategoryList from '../../Product/ProductInCategoryList/Default'

function CategoryProduct(props) {

  const {id,category} = props.match.params;
  const [auth ] = useContext( CRMContext );

  const [search, saveSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [refreshProducts, setRefreshProducts] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const readSearchData = e => {
    saveSearch( e.target.value );
  }

  useEffect(()=>{

    if(!auth.auth && (localStorage.getItem('token')===auth.token)) {
        return props.history.push('/login')
    };

    if(id){
        //Query a la API
        const API = async () => {
            await axios.get(`/product-by-category/${id}`,{
                headers: {
                    Authorization : `Bearer ${auth.token}`
                }
            })
            .then(()=>{
              setRefreshProducts(!refreshProducts)
            })
        }
        API();
    };
    return () => {};
},[auth.token, auth.auth, id, props.history, refresh]);

 
const searchProduct  = async e => {
  e.preventDefault();
  setProducts([[]])
  // obtener los productos de la busqueda
  const bg = await axios.post(`/products/search/${search}`,'',{
    headers: {
      Authorization : `Bearer ${auth.token}`
    }
  });

  for (let value of Object.values(products)) {
    products.pop(value);
  }

  if(bg.data.length>0) { 
    bg.data.forEach(p => {
      products.push(p);
    });
    setProducts([...products]);
    
  } else {
      // no hay resultados
      Swal.fire({
          type: 'error',
          title: 'No Resultados',
          text: 'No hay resultados'
      })
  }
}

const addToCategory = async i => {

  const all = [...products];
  await axios.post(`/product-by-category/${id}/${all[i]._id}`,null,{
    headers: {
      Authorization : `Bearer ${auth.token}`
    }
  }).then( ()=>{
    setRefresh(!refresh);
  });
}

  return (
    <Fragment>
      <div>
        <h2>{`${category}`}</h2>

        <ProductSearch
          searchProduct={searchProduct}
          readSearchData={readSearchData}
        />

          <ul className="resumen">
            {products.map((product, index) => (
                <ProductSearchResult
                    key={product._id}
                    product={product}
                    index={index}
                    addToCategory = {()=>addToCategory(index)}
                />
            ))}
          </ul>

      </div>
      <ProductInCategoryList
        key = {id}
        categoryId = {id} 
        refreshProducts = {refreshProducts}
      >
      </ProductInCategoryList>
    </Fragment>
  )
}

export default withRouter(CategoryProduct);