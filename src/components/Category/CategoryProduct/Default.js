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
  const [productsInCategory, setProductsInCategory] = useState([]);

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
            .then(bg=>{
              setProductsInCategory(bg.data)
            })
        }
        API();
    };
    return () => {};
},[auth.token, auth.auth,  productsInCategory, id,props.history]);

const searchProduct  = async e => {
  e.preventDefault();

  // obtener los productos de la busqueda
  const bg = await axios.post(`/products/search/${search}`,'',{
    headers: {
      Authorization : `Bearer ${auth.token}`
    }
  });

  if(bg.data.length>0) {

    bg.data.forEach((p,i) => {
      let res = bg.data[i];
      products.push(res);
      setProducts([...products]);
    });
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
  }).then(res=>{
    setProductsInCategory([...products,res.data]);
  });

}

const readSearchData = e => {
  saveSearch( e.target.value );
}

const removeProduct = async id => {

  alert(id)
  await axios.put(`/product-by-category/${id}`,null,{
    headers: {
      Authorization : `Bearer ${auth.token}`
    }
  }).then(res=>{
    setProductsInCategory([...products,res.data]);
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
                    addToCategory = {addToCategory}
                />
            ))}
          </ul>

      </div>
      <div>
        <h2>Productos en Categoria</h2>
        <ul className="responsive-table">
          <li className="table-header">
            <div className="col col-1">Producto</div>
            <div className="col col-2">Precio</div>
            <div className="col col-3">Quitar</div>
          </li>
          {
            productsInCategory.map((product, index) => (
              <ProductInCategoryList
                key = {product._id}
                product = {product}
                removeProduct = {removeProduct}
              >
              </ProductInCategoryList>
            ))
          }
        </ul>
      </div>
    </Fragment>
  )
}

export default withRouter(CategoryProduct);