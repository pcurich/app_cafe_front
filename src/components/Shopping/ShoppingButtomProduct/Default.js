import React,{useState, useEffect} from 'react';

function ShoppingButtonProduct({product,shoppingCartKey}) {

    const {_id,long_name, price, photo} = product

    const[quantity, setQuantity] = useState({value:0});
    const[update, setUpdate] = useState(false);

    useEffect(() => {

      const API = async () => {
        console.log("productId " + _id);
        console.log("cantidad "+quantity.value);
        console.log("client ")
        console.log(JSON.parse(localStorage.getItem('cart')));
        //setUpdate(!update) localstorage
      }
      API();
      return () => {};

  }, [_id, quantity.value, update]);

  const decrease =  () => {
    if(quantity.value===0) return
    quantity.value = quantity.value - 1;
    setUpdate(!update);
    console.log("decrease");
    console.log(quantity.value);
    saveProduct()
}

const increase = () => {
  quantity.value = quantity.value + 1;
  setUpdate(!update)
  console.log("increase");
  console.log(quantity.value);
  saveProduct()
}

const saveProduct = ()=>{
  var shoppingCart = JSON.parse(localStorage.getItem('cart'))
  if (shoppingCartKey === shoppingCart.id){
    var e = shoppingCart.details.find(function(e){return e.productId === _id })
    if(e){
      shoppingCart.details.forEach((e ,i)=> {
        if(e.productId === _id){
          shoppingCart.details[i].quantity = quantity.value
        }
      });
    }else{
      shoppingCart.details.push({productId:_id,quantity:quantity.value});
    }
    if(quantity.value === 0){
      shoppingCart.details.forEach((e ,i)=> {
        if(e.productId === _id){
          shoppingCart.details.splice(i,1)
        }
      });
    }
    localStorage.setItem('cart', JSON.stringify(shoppingCart));
  }
}

// const updateStete = () => {
//   setQuantity({
//       ...customer,
//       [e.target.name]: e.target.value
//   })
// }

    return(
      <div className="flexContainer">
        <div className="flexItem">
          <img style={{"verticalAlign":"middle"}} src={`${process.env.REACT_APP_BACKEND_URL}/${photo}`} alt="imagen" width="60" height="60" />
        </div>
        <div className="flexItem">{long_name}</div>
        <div className="flexItem">{'S/' +  price.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, 'S/1,')} </div>
        <div className="flexItem">
          <button type="button" className="btn btn-azul" onClick={() => decrease()}>
            <i className="fas fa-minus"></i>
          </button>
        </div>
        <div className="flexItem">{quantity.value}</div>
        <div className="flexItem">
          <button type="button" className="btn btn-azul" onClick={() => increase() }>
            <i className="fas fa-plus"></i>
          </button>
        </div>
        <div>
        <button
          type="button"
          className="btn btn-rojo"
          // onClick={() => eliminarProductoPedido(producto._id)}
        >
        <i className="fas fa-minus-circle"></i>
        </button>
        </div>
      </div>
    )
}

export default ShoppingButtonProduct;