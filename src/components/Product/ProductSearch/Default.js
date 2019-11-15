import React from 'react';

function ProductSearch(props) {
    return(
            <form onSubmit={props.searchProduct}>
                <legend>Busca un Producto</legend>
                <div className="campo">
                    <label>Productos:</label>
                    <input
                        type="text"
                        placeholder="Nombre"
                        name="productos"
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