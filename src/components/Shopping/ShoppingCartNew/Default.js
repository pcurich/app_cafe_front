import React, {useState, useEffect, Fragment} from 'react';
import axios from '../../../config/axios';
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';

import FormSearchProduct from './FormSearchProduct';
import FormProduct from './FormProduct';

function NewShpingCart(props) {

    // extraer ID de cliente
    const { id } = props.match.params;

    // state
    const [customer, saveCustomer] = useState({});
    const [search, saveSearch] = useState('');
    const [products, saveProducts] = useState([]);
    const [total, saveTotal] = useState(0);

    useEffect(() => {

        // obtener el cliente
        const API = async () => {
            // consultar el cliente actual
            const bg = await axios.get(`/customers/${id}`);
            saveCustomer(bg.data);
        }
        API();
        // actualizar el total a pagar
        // si el arreglo de productos es igual 0: el total es 0
        if(products.length === 0) {
            saveTotal(0);
            return;
        }

        // calcular el nuevo total
        let newTotal = 0;

        // recorrer todos los productos, sus cantidades y precios
        products.map(product => newTotal += (product.quantity * product.price)  );

        // almacenar el Total
        saveTotal(newTotal);

    }, [id, products]);

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

    const readSearchData = e => {
        saveSearch( e.target.value );
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

    return (
        <Fragment>
            <h2>Nuevo Pedido</h2>

            <div className="ficha-cliente">
                <h3>Datos de Cliente</h3>
                <p>Nombre: {customer.name} {customer.last_name}</p>
                <p>Teléfono: {customer.phone}</p>
            </div>

            <FormSearchProduct
                searchProduct={searchProduct}
                readSearchData={readSearchData}
            />

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