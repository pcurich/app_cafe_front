import React from 'react';

function ShoppingButtonProduct({product,increase,decrease,index}) {

    const {long_name, price, photo} = product

    const flexContainer = [
      {"background-color":"salmon"},
      {"color":"white"},
      {"padding": "1em"},
      {"display":"flex"}
    ]
    const flexItem  = [
      {"flex-wrap":"wrap"},
      {"flexDirection":"column"},
      {"justifyContent":"spaceAround"}
    ]



    return(
      <div className={flexContainer}>
<div className={flexItem}>
<img style={{"verticalAlign":"middle"}} src={`${process.env.REACT_APP_BACKEND_URL}/${photo}`} alt="imagen" width="60" height="60" />
</div>
    <div className={flexItem}>{product.long_name}</div>
    <div className={flexItem}>{product.price}</div>
        <div className={flexItem}>+</div>
        <div className={flexItem}><input type="Number" /></div>
        <div className={flexItem}>-</div>
      </div>
    )
}

export default ShoppingButtonProduct;