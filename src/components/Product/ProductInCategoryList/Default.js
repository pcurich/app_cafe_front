import React,{Fragment,useState} from 'react';

function ProductInCategoryList(props) {

    var {product, removeProduct} = props
    const[showData, setShowData]= useState(false);

    var hidden = {
        "display": `${showData?'none':''}`
    }

    const remove = (id) => {
        removeProduct(id);
        setShowData(false);
    }

    return(
        <Fragment>
            <li className="table-row"  style={hidden}>
                <div className="col col-1" data-label="Producto">{product.name}</div>
                <div className="col col-2" data-label="Precio">S/ {product.price}</div>
                <div className="col col-3" data-label="Quitar">
                <button
                    type="button"
                    className="btn btn-rojo"
                    onClick={() => remove(product._id)}
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