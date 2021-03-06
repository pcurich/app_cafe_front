import React,{Fragment} from 'react';
import {Link} from 'react-router-dom'
import Swal from 'sweetalert2';
import axios from '../../../config/axios'


function Product({product}) {

    const {_id, short_name,long_name, price, photo,available } = product

    var styleLeft = {
        "marginLeft": "16px",
        "color" : `${available?'green':'red'}`
    };
    const deleteProduct = id => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Un producto eliminado no se puede recuperar",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {
                axios.delete(`/products/${id}`)
                .then(res => {
                    if(res.status === 200){
                        Swal.fire(
                            'Eliminado',
                            res.data.message,
                            'success'
                        )
                    }
                })
            }
        })
    }

    return (
        <Fragment>
            <li className="producto">
                    <div className="info-producto">
                        <p className="nombre">{short_name}</p>
                        <p className="nombre" style={{'fontSize' : '1.5rem'}}>{long_name}
                        {
                            available? (
                                <i className="fas fa-circle" style={styleLeft}></i>
                            ):(
                                <i className="fas fa-circle" style={styleLeft}></i>
                            )
                        }
                        </p>
                        <p className="precio">S/. {price}</p>
                        {
                            photo ?
                            (
                                <img src={`${process.env.REACT_APP_BACKEND_URL}/${photo}`} alt="imagen" height="60" width="60"  />
                            ) : null
                        }
                    </div>
                    <div className="acciones">
                        <Link to={`/product/edit/${_id}`} className="btn btn-azul">
                            <i className="fas fa-pen-alt"></i>
                            Editar Producto
                        </Link>

                        <button
                            type="button"
                            className="btn btn-rojo btn-eliminar"
                            onClick={()=> deleteProduct(_id)}
                        >
                            <i className="fas fa-times"></i>
                            Eliminar Producto
                        </button>
                    </div>
                </li>
        </Fragment>
    )
}

export default Product;
