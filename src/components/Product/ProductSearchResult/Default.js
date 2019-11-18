import React from 'react';

function ProductSearchResult(props) {

    const {product, addToCategory,  index } = props;

    return(
        <li>
            <div className="texto-producto">
                <p className="nombre">{product.name}</p>
            </div>
            <div className="acciones">
                <div className="contenedor-cantidad">
                    <i 
                        className="fas fa-plus"
                        onClick={() => addToCategory(index) }
                    ></i>
                </div>
            </div>
        </li>
        )
}    
export default ProductSearchResult;