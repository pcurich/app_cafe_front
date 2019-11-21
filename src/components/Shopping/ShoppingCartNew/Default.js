import React, {useState, useEffect,useContext, Fragment} from 'react';
import axios from '../../../config/axios';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';

import { CRMContext } from '../../../context/CRMContext';

import FormSearchProduct from './FormSearchProduct';
import FormProduct from './FormProduct';

import CustomerSearch from '../../Customer/CustomerSearch/Default'
import CustomerSearchResult from '../../Customer/CustomerSearchResult/Default'

import ShoppingButtonCategory from '../ShoppingButtonCategory/Default';

function NewShpingCart(props) {

    // extraer ID de cliente
    let { id } = props.match.params;
    const [auth ] = useContext( CRMContext );

    // state
    const [customer, setCustomer] = useState({});
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [products, saveProducts] = useState([]);
    const [total, saveTotal] = useState(0);

    useEffect(() => {
        
        if(!auth.auth && (localStorage.getItem('token')===auth.token)) {
            return props.history.push('/login')
        };

        const API = async () => {
            try {
                await axios.get(`/categories/`, {
                    headers: {
                        Authorization : `Bearer ${auth.token}`
                    }
                })
                .then( bg=>{
                    setCategories(bg.data)
                });
            } catch (err) {
                if(err.response.status === 500) {
                    props.history.push('/login');
                }
            }
            
        } 
        API();
        return () => {};
        // if(products.length === 0) {
        //     saveTotal(0);
        //     return;
        // }

        // calcular el nuevo total
        // let newTotal = 0;

        // // recorrer todos los productos, sus cantidades y precios
        // products.map(product => newTotal += (product.quantity * product.price)  );

        // // almacenar el Total
        // saveTotal(newTotal);

    }, [id, customer, products]);

    const searchProduct  = async e => {
        e.preventDefault();

        // obtener los productos de la busqueda
        const bg = await axios.post(`/products/search/${search}`);

        // si no hay resultados una alerta, contrario agregarlo al state
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

    const searchCustomer = async e =>{
        e.preventDefault();
        const bg = await axios.post(`/customers/search/${search}`,'',{
            headers: {
                Authorization : `Bearer ${auth.token}`
            }
        })

        if(bg.data.length>0) {
            setCustomer(bg.data[0]);
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
        setSearch( e.target.value );
    }

    // actualizar la cantidad de productos
    const decrease = i => {
        // copiar el arreglo original de productos
        const all = [...products];

        // validar si esta en 0 no puede ir mas alla
        if(all[i].quantity === 0) return;

        // decremento
        all[i].quantity--;

        // almacenarlo en el state
        saveProducts(all);

    }

    const increase = i => {
       // copiar el arreglo para no mutar el original
        const all = [...products];

       // incremento
        all[i].quantity++;

       // almacenarlo en el state
        saveProducts(all);
    }

    // Elimina Un producto del state
    const removeProduct = id => {
        const all = products.filter(product => product.product !== id );

        saveProducts(all)
    }

    const createShoppingCart = async e => {
        e.preventDefault();

        // extraer el ID
        const { id } = props.match.params;

        // construir el objeto
        const shoppingcart = {
            "customer" : id,
            "details" : products,
            "total" : total
        }
        console.log(shoppingcart);

        // almacenarlo en la BD
        const result = await axios.post(`/shoppingcart/new/${id}`, shoppingcart);

        // leer resultado
        if(result.status === 200) {
            // alerta de todo bien
            Swal.fire({
                type: 'success',
                title: 'Correcto',
                text: result.data.message
            })
        } else {
            // alerta de error
            Swal.fire({
                type: 'error',
                title: 'Hubo un Error',
                text: 'Vuelva a intentarlo'
            })
        }

        // redireccionar
        props.history.push('/shoppingCart');
    }

    // Si el state esta como false
    if(!auth.auth && (localStorage.getItem('token')===auth.token)) {
        return props.history.push('/login')
    };

    return (
        <Fragment>
            <h2>Nuevo Pedido</h2>

            <div className="ficha-cliente">
                {
                    customer._id?
                        <CustomerSearchResult
                            key = {customer._id}
                            customer = {customer}
                        ></CustomerSearchResult>
                    :
                        <CustomerSearch
                            key = {customer._id}
                            readSearchData = {readSearchData}
                            searchCustomer = {searchCustomer}
                        ></CustomerSearch>
                    
                }
                
            </div>

            {/* <FormSearchProduct
                searchProduct={searchProduct}
                readSearchData={readSearchData}
            /> */}
            {
                categories.map(category=>(
                    <ShoppingButtonCategory
                    key={category._id}
                    category={category}
                    />)
                )
            } 

            <ul className="resumen">
                {products.map((product, index) => (
                    <FormProduct
                        key={product.product}
                        product={product}
                        decrease={decrease}
                        increase={increase}
                        removeProduct={removeProduct}
                        index={index}
                    />
                ))}

            </ul>
            <p className="total">Total a Pagar: <span>S/. {total}</span> </p>
            { total > 0 ? (
                <form
                    onSubmit={createShoppingCart}
                >
                    <input type="submit"
                        className="btn btn-verde btn-block"
                        value="Realizar Pedido" />
                </form>
            ) : null }
        </Fragment>
    )
}

export default withRouter(NewShpingCart);