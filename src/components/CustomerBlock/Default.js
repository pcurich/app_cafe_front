import React,{Fragment} from 'react'; 
import {Link} from 'react-router-dom'
import Swal from 'sweetalert2';
import axios from '../../config/axios'

function Customer({customer}) {
    
    const {_id, name, last_name, company, email, phone } = customer

    const deleteCustomer = id => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Un cliente eliminado no se puede recuperar",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.value) {
                axios.delete(`/customers/${id}`)
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

    return (
        <Fragment>
            <li className="cliente">
                <div className="info-cliente">
                    <p className="nombre">{name} {last_name}</p>
                    <p className="empresa">{company}</p>
                    <p>{email}</p>
                    <p>{phone}</p>
                </div>
                <div className="acciones">
                    <Link to={`/customer/edit/${_id}`} className="btn btn-azul">
                        <i className="fas fa-pen-alt"></i>
                        Editar Cliente
                    </Link>
                    
                    <Link to={`/shoppingCart/new/${_id}`} className="btn btn-amarillo">
                        <i className="fas fa-plus"></i>
                        Nuevo Pedido
                    </Link>
                    <button 
                        type="button" 
                        className="btn btn-rojo btn-eliminar"
                        onClick = {() => deleteCustomer(_id)}
                    >
                        <i className="fas fa-times"></i>
                        Eliminar Cliente
                    </button>
                </div>
            </li>   
        </Fragment>
        
    )
}

export default Customer;