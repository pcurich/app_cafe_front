import React,{Fragment} from 'react';

function ProductInCategoryList(props) {

    var {product, removeProduct} = props

    return(
        <Fragment>
            <li className="table-row">
                <div className="col col-1" data-label="Producto">{product.name}</div>
                <div className="col col-2" data-label="Precio">S/ {product.price}</div>
                <div className="col col-3" data-label="Quitar">
                <button 
                    type="button" 
                    className="btn btn-rojo"
                    onClick={() => removeProduct(product._id)}
                >
                <i className="fas fa-minus-circle"></i>
                    Quitar
                </button>
                </div>
            </li>
        </Fragment>
    )
}

export default ProductInCategoryList;