import React from 'react';

function CustomerSearchResult(props) {

    const {customer } = props;

    return(
        <div>
            <h3>Datos de Cliente</h3>
            <p>Nombre: {customer.name} {customer.last_name}</p>
            <p>Teléfono: {customer.phone}</p>
        </div>
        )
}    
export default CustomerSearchResult;