import React from 'react';

function ShoppingButtonCategory({category,categorySelected}) {

    const {name, photo} = category


    const content = {"alignItems": "center"}

    return(
        <div>
            <button type="button"  className="btn button-transparent" onClick={categorySelected}>
                <div className={content}>
                    <img style={{"verticalAlign":"middle"}} src={`${process.env.REACT_APP_BACKEND_URL}/${photo}`} alt="imagen" width="60" height="60" />
                    <span style={{"paddingLeft":"5px"},{"color":"black"}}>{name}</span>
                </div>
            </button>
            <hr></hr>
        </div>
    )
}

export default ShoppingButtonCategory;