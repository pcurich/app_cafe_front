import React, {useState, useEffect,useContext, Fragment} from 'react';
import axios from '../../../config/axios';
import Swal from 'sweetalert2';
import uuid from  'uuid-random';

import { withRouter } from 'react-router-dom';

import { CRMContext } from '../../../context/CRMContext';

import CustomerSearch from '../../Customer/CustomerSearch/Default'
import CustomerSearchResult from '../../Customer/CustomerSearchResult/Default'

import ShoppingButtonCategory from '../ShoppingButtonCategory/Default';
import ShoppingButtonProduct from '../ShoppingButtomProduct/Default';

function NewShpingCart(props) {

    // extraer ID de cliente
    let { id } = props.match.params;
    const [auth ] = useContext( CRMContext );

    // state
    const [customer, setCustomer] = useState({});
    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState('');
    const [products, saveProducts] = useState([]);
    const [shoppingCart, ] = useState({id:uuid(),customer:'',details:[],total:0});
    const [total, setTotal] = useState(0);

    useEffect(() => {

        if(!auth.auth && (localStorage.getItem('token')===auth.token)) {
            return props.history.push('/login')
        };

        const API = async () => {
            try {
                await axios.get('/categories',{
                    headers: {
                        Authorization : `Bearer ${auth.token}`
                    }
                })
                .then( bg=>{
                    setCategories(bg.data)
                    localStorage.setItem('cart', JSON.stringify(shoppingCart));
                });
            } catch (err) {
                if(err.response.status === 500) {
                    props.history.push('/login');
                }
            }
        }
        API();
        return () => {};

    }, [id, auth.auth, auth.token, props.history, shoppingCart]);

    const searchCustomer = async e =>{
        e.preventDefault();

        if(!auth.auth && (localStorage.getItem('token')===auth.token)) {
            return props.history.push('/login')
        };

        const bg = await axios.post(`/customers/search/${search}`,'',{
            headers: {
                Authorization : `Bearer ${auth.token}`
            }
        })

        if(bg.data.length>0) {
            setCustomer(bg.data[0]);
            var str = JSON.parse(localStorage.getItem('cart'));
            str.customer = bg.data[0]._id;
            localStorage.setItem('cart',JSON.stringify(str));
        } else {
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

    const categorySelected = async categoryId =>{

        if(!auth.auth && (localStorage.getItem('token')===auth.token)) {
            return props.history.push('/login')
        };

        await axios.get(`/product-by-category/${categoryId}`,{
            headers: {
                Authorization : `Bearer ${auth.token}`
            }
        })
        .then(bg=>{
            saveProducts(bg.data);
        });
    }

    const createShoppingCart = async e => {
        e.preventDefault();

        products.forEach((p,i) =>{
            if(p.quantity > 0) {
                console.log(i)
                console.log(p)
            }
        })

        // extraer el ID
        const { id } = props.match.params;

        // construir el objeto
        const shoppingcart = {
            "customer" : id,
            "details" : products,
            "total" : total
        }

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

    const updateTotal = (e) => {
        var shoppingCart = JSON.parse(localStorage.getItem('cart'));
        setTotal(shoppingCart.total)
    }

    return (
        <Fragment>
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

            <div className="grid contenedor contenido-principal">
                <aside className="sidebar col-2">
                {
                    categories.map(category=>(
                        <ShoppingButtonCategory
                        key={category._id}
                        category={category}
                        categorySelected = {()=>categorySelected(category._id)}
                    />
                    ))
                }
                </aside>

                <main className="caja-contenido col-10" style={{"backgroundColor":"#f3f3f3"}}>
                <ul className="resumen">
                        {products.map((product) => (
                            <ShoppingButtonProduct
                                key={product._id}
                                product={product}
                                shoppingCartKey = {shoppingCart.id}
                                updateTotal= {updateTotal}
                            />
                        ))}
                    </ul>
                </main>
            </div>

            <p className="total">Total a Pagar: <span>S/. {'S/' +  total.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, 'S/1,')}</span> </p>
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