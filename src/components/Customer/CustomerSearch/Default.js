import React from 'react';

function CustomerSearch(props) {
    return(
            <form onSubmit={props.searchCustomer}>
                <legend>Buscar Cliente</legend> 

                <div className="campo">
                    <label>Dni:</label>
                    <input 
                        type="text" 
                        placeholder="Documento Nacional de Identidad" 
                        name="customers" 
                        onChange={props.readSearchData}
                    />
                <input
                    type="submit"
                    className="btn btn-azul"
                    value="Buscar"
                />
                </div>
            </form>
    )
}

export default CustomerSearch;