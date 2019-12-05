import React,{Fragment} from 'react';


function SummaryByDay(props) {
    return(
        <Fragment>
            <form onSubmit={props.searchDay}>
                <div className="campo">
                    <label>Fecha:</label>
                    <input
                        type="date"
                        name="fecha"
                        onChange={props.readDateData} 
                        value = {props.value}
                    />
                <input
                    type="submit"
                    className="btn btn-azul"
                    value="Consultar"
                />
                </div>
            </form>
        </Fragment>
    )
}

export default SummaryByDay;