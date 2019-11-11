import React,{Fragment} from 'react'; 
import {Link} from 'react-router-dom'
import Swal from 'sweetalert2';
import axios from '../../config/axios'


function Product({product}) {
    
    const {_id, name, price, photo } = product

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
                        <p className="nombre">{name}</p>
                        <p className="precio">S/. {price}</p>
                        {
                            photo ? 
                            (
                                <img src={`${process.env.REACT_APP_BACKEND_URL}/${photo}`} alt="imagen" />
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
