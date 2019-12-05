
import React from 'react';
import moment from "moment"

function ShoppingCardOrder({order}) { 

    console.log(order);
    return(
        <li className="pedido">
            <div className="info-pedido">
                <p className="id">{order._id} </p>
                <p className="nombre">
                    {moment(order.date).format('LLL')}                
                </p>

                <p className="productos">Productos Vendidos: </p>

                <div className="articulos-pedido">
                    
                    <ul>
                        {order.details.map(item => (
                            <li key={order._id+item.product._id}>
                                <p>{item.product.long_name} </p>
                                <p>Precio: S/ {item.product.price.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, 'S/1,')} </p>
                                <p>Cantidad: {item.quantity}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                <p className="total">Total: S/ {order.total.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, 'S/1,')} ({order.paymentType === "Cash"?"Efectivo":"Tarjeta"})</p>

            </div>
            {/* <div className="acciones">
                <button type="button" className="btn btn-rojo btn-eliminar">
                    <i className="fas fa-times"></i>
                    Eliminar Pedido
                </button>
            </div> */}
        </li>
    )
}

export default ShoppingCardOrder;