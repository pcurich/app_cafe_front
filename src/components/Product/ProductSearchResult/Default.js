import React from 'react';

function ProductSearchResult(props) {

    const {product, add,   index } = props;

    return(
        <li>
            <div className="texto-producto">
                <p className="nombre">{product.name}</p>
            </div>
            <div className="acciones">
                <div className="contenedor-cantidad">
                  <i
                      className="fas fa-plus"
                      onClick={() => add(index) }
                  ></i>
                </div>
            </div>
        </li>
    )
}

export default ProductSearchResult;