import React from 'react';

function ProductSearch(props) {
    return(
        <div className="ficha-cliente">
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
                    <input
                        type="submit"
                        className="btn btn-azul"
                        value="Buscar"
                    />
                </div>
                

            </form>
        </div>
    )
}

export default ProductSearch;