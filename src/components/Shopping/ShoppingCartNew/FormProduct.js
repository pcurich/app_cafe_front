import React from 'react';

function FormProduct(props) {

    const {product, decrease, increase, removeProduct,  index } = props;

    return(
        <li>
            <div className="texto-producto">
                <p className="nombre">{product.long_name}</p>
                <p className="precio">$ {product.price}</p>
            </div>
            <div className="acciones">
                <div className="contenedor-cantidad">
                    <i
                        className="fas fa-minus"
                        onClick={() => decrease(index) }
                    ></i>
                    <p>{product.quantity}</p>
                    <i
                        className="fas fa-plus"
                        onClick={() => increase(index) }
                    ></i>
                </div>
                <button
                    type="button"
                    className="btn btn-rojo"
                    onClick={() => removeProduct(product._id)}
                >
                    <i className="fas fa-minus-circle"></i>
                        Eliminar Producto
                </button>
            </div>
        </li>
    )
}

export default FormProduct;