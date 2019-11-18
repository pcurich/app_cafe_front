import React from 'react';

function ProductSearch(props) {
    return(
            <form onSubmit={props.searchProduct}>
                <legend>Busqueda de Productos</legend> 

                <div className="campo">
                    <label>Nombre:</label>
                    <input 
                        type="text" 
                        placeholder="Nombre del producto" 
                        name="products" 
                        onChange={props.readSearchData}
                    />
                </div>

                <input
                    type="submit"
                    className="btn btn-azul btn-block"
                    value="Buscar"
                />

            </form>
    )
}

export default ProductSearch;