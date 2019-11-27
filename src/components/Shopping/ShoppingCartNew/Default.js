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
    const [shoppingCart,setShoppingCart] = useState({customer:{},details:[],total:{}});
    const [total, saveTotal] = useState(0);

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

    }, [id, customer, auth.auth, auth.token, props.history]);

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
            shoppingCart.customer = bg.data[0];
            setShoppingCart(shoppingCart);
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
    const decrease = id => {
        var e = false;
        for(let i = 0 ; i< shoppingCart.details.length; i++){
            if(shoppingCart.details[i].product===id){
                e=true;
                if(shoppingCart.details[i].quantity!==0){
                    shoppingCart.details[i].quantity--;
                }
            }
        }

        if(!e){
            for (let i = 0; i < products.length; i++) {
                if(id === products[i]._id){
                    var data = { product: products[i]._id,quantity:0}
                    shoppingCart.details.push(data);
                    break;
                }
            }
        }
        quantity(id)
    }

    const increase = id => {
        var e = false;
        for(let i = 0 ; i< shoppingCart.details.length; i++){
            if(shoppingCart.details[i].product===id){
                e=true;
                if(shoppingCart.details[i].quantity!==0){
                    shoppingCart.details[i].quantity++;
                }
            }
        }

        if(!e){
            for (let i = 0; i < products.length; i++) {
                if(id === products[i]._id){
                    var data = { product: products[i]._id,quantity:1}
                    shoppingCart.details.push(data);
                    break;
                }
            }
        }
        quantity(id)
    }

    const quantity = id => {
        for(let i = 0 ; i< shoppingCart.details.length; i++){
            if(shoppingCart.details[i].product===id){
                return shoppingCart.details[i].quantity
            }
        }
        return 0;
    }

    // Elimina Un producto del state
    const removeProduct = id => {
        const all = products.filter(product => product.product !== id );
        saveProducts(all)
    }

    const categorySelected = async categoryId =>{
        await axios.get(`/product-by-category/${categoryId}`,{
            headers: {
                Authorization : `Bearer ${auth.token}`
            }
        })
        .then(bg=>{
            saveProducts(bg.data);
            console.log(products);
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
                                quantity = {quantity}
                                decrease={()=>decrease(product._id)}
                                increase={()=>increase(product._id)}
                                // removeProduct={removeProduct}
                                // index={index}
                            />
                        ))}

                    </ul>
                </main>
            </div>

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