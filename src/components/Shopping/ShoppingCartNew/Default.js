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

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`
        }

        const steps = ['1', '2' ]
        Swal.mixin({
            confirmButtonText: 'Siguiente &rarr;',
            cancelButtonText: 'Cancelar',
            showCancelButton: true,
            reverseButtons: true,
            validationMessage: 'El valor es requerido',
            progressSteps: steps
        }).queue([
            {
                title: 'Medio de pago',
                text: 'Seleccione el medio de pago',
                input: 'select',
                inputOptions: {
                    Efectivo: 'Efectivo',
                    Tarjeta: 'Tarjeta'
                },
                inputPlaceholder: 'Seleccione un método de pago',
                inputAttributes: {
                    required: true
                }
            },
            {
                title: 'Monto recibido',
                text: 'Ingrese el monto recibido por el cliente',
                input: 'number',
                inputAttributes: {
                    required: true,
                    min:0.00,
                    step:0.01
                },
            },
        ]).then((result) => {
            if (result.value) { 
                
                console.log(result.value);

                const cart = JSON.parse(localStorage.getItem("cart"));

                const json = {
                    "id"            : cart.id,
                    "user"          : localStorage.getItem("user"),
                    "customer"      : cart.customer,
                    "details"       : cart.details,
                    "paymentType"   : (result.value[0] === "Efectivo"? 'Cash':'Credit'),
                    "cash"          : (result.value[0] === "Efectivo"? result.value[1]: 0),
                    "credit"        : (result.value[0] === "Tarjeta"? result.value[1]: 0),
                    "change"        : (cart.total*1.0 - result.value[1]*1.0).toFixed(2),
                    "total"         : cart.total
                }

                axios.post(`/shoppingcart/new/${id}`, json,{ headers: headers })
                .then(res => {
                    console.log("res.data.cart");
                    console.log(res.data.cart);
                    if(res.status === 200){

                        localStorage.removeItem("cart");

                        Swal.fire({
                            title: res.data.message,
                            html: `
                                <p>Método selecionado <b>${result.value[0]}</b> </p>
                                <p>Monto Ingresado <b>S/ ${((result.value[1])*1).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, 'S/1,')}</b> </p>
                                <p>Total <b>S/ ${((total*1)).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, 'S/1,')}</b> </p>
                                <p>Vuelto <b>S/ ${((result.value[1]-total)*1).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, 'S/1,')}</b> </p>
                                <p>Vendedor <b>${localStorage.getItem("user")}</b></p>
                                `,
                            confirmButtonText: 'Imprimir'
                        })
                    }
                    props.history.push('/SummaryByDay');
                }).catch(err => {
                    Swal.fire({
                        type:'error',
                        title:'Hubo un error',
                        text:err
                    })
                });
            }
        }) 
    }

    // Si el state esta como false
    if(!auth.auth && (localStorage.getItem('token')===auth.token)) {
        return props.history.push('/login')
    };

    const updateTotal = (e) => {
        var shoppingCart = JSON.parse(localStorage.getItem('cart'));
        setTotal(shoppingCart.total)
    }

    if(!auth.auth && (localStorage.getItem('token')===auth.token)) {
        return props.history.push('/login')
    };

    return (
        <Fragment>
            <div className="ficha-total">
                <div className="ficha-total-child-cliente">
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
                </div>
                <div className="ficha-total-child-total">
                    <p className="total"><span>S/. {total.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, 'S/1,')}</span> </p>
                </div>
            </div>

            <form onSubmit={createShoppingCart} >
                <input type="submit" className="btn btn-verde btn-block" disabled={total===0} value="Pagar" />
            </form>

            

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
        </Fragment>
    )
}

export default withRouter(NewShpingCart);