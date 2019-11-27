import React,{useState, useEffect} from 'react';

function ShoppingButtonProduct({product}) {

    const {_id,long_name, price, photo} = product

    const[quantity, setQuantity] = useState(0);

    useEffect(() => {

      const API = async () => {
        console.log("quantity");
        console.log(quantity)
      }
      API();
      return () => {};

  }, [quantity]);

  const decrease =  () => {
    if(quantity===0) return
    quantity--;
    // setQuantity(quantity);
    console.log("decrease");
}

const increase = () => {
    quantity++;
    // setQuantity(quantity);
    console.log("increase");
}

    return(
      <div className="flexContainer">
        <div className="flexItem">
          <img style={{"verticalAlign":"middle"}} src={`${process.env.REACT_APP_BACKEND_URL}/${photo}`} alt="imagen" width="60" height="60" />
        </div>
        <div className="flexItem">{long_name}</div>
        <div className="flexItem">{'S/' +  price.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, 'S/1,')} </div>
        <div className="flexItem">
          <i
            className="fas fa-minus btn btn-azul"
            onClick={() => decrease()}
          ></i>
        </div>
        <div className="flexItem">{quantity.value}</div>
        <div className="flexItem btn btn-azul">
        <i
            className="fas fa-plus"
            onClick={() => increase() }
          ></i>
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