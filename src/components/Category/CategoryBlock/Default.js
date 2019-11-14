import React,{Fragment} from 'react'; 
import {Link} from 'react-router-dom'
import Swal from 'sweetalert2';
import axios from '../../../config/axios'

function Category({category}) {
    const {_id, name, photo, grouped_products, available } = category;
    const PATH = '/categories';

    const deleteCategory = id => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Una categoria eliminada conlleva a eliminar los productos asociados y las ventas realizadaspor",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {
                axios.delete(`${PATH}/${id}`)
                .then(res => {
                    Swal.fire(
                        'Eliminado',
                        res.data.message,
                        'success'
                    )
                })
            }
        })
    }

    var styleRight = {
        "marginRight": "16px"
    };

    var styleLeft = {
        "marginLeft": "16px",
        "color" : `${available?'green':'red'}`
    };

    return (
        <Fragment>
            <li className="categoria">
                <div className="info-categoria">
                    <p className="nombre">
                    {
                        grouped_products? (
                            <i className="fas fa-circle" style={styleRight}></i> 
                        ):(
                            <i className="far fa-circle" style={styleRight}></i> 
                        )
                    }
                    {name}
                    {
                        available? (
                            <i className="fas fa-circle" style={styleLeft}></i> 
                        ):(
                            <i className="fas fa-circle" style={styleLeft}></i> 
                        )
                    }
                    </p>

                    <p className="empresa">{available}</p> 
                    {
                        photo ? 
                        (
                            <img src={`${process.env.REACT_APP_BACKEND_URL}/${photo}`} alt="imagen" width="300" />
                        ) : null
                    }
                </div>
                <div className="acciones">
                    <Link to={`category/edit/${_id}`} className="btn btn-azul">
                        <i className="fas fa-pen-alt"></i>Editar Categoria
                    </Link>
                    <Link to={`category/edit/${_id}`} className="btn btn-amarillo">
                        <i className="fas fa-plus"></i>Agregar Producto
                    </Link>  
                    
                    <button 
                        type="button" 
                        className="btn btn-rojo btn-eliminar"
                        onClick = {() => deleteCategory(_id)}
                    >
                        <i className="fas fa-times"></i>
                        Eliminar Categoria
                    </button>
                </div>
            </li>   
        </Fragment>
        
    )
}

export default Category;