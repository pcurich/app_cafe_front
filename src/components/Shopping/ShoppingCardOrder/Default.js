
import React from 'react';

function ShoppingCardOrder({order}) {

    const {customer} = order;

    return(
        <li className="pedido">
            <div className="info-pedido">
                <p className="id">{order._id}</p>
                <p className="nombre">
                    {order.customer ? order.customer.name + ' ' + order.customer.last_name : null }
                </p>

                <div className="articulos-pedido">
                    <p className="productos">Artículos Pedido: </p>
                    <ul>
                        {order.details.map(item => (
                            <li key={order._id+item.product._id}>
                                <p>{item.product.name} </p>
                                <p>Precio: ${item.product.price} </p>
                                <p>Cantidad: {item.quantity}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="total">Total: S/. {order.total} </p>

            </div>
            <div className="acciones">
                <button type="button" className="btn btn-rojo btn-eliminar">
                    <i className="fas fa-times"></i>
                    Eliminar Pedido
                </button>
            </div>
        </li>
    )
}

export default ShoppingCardOrder;