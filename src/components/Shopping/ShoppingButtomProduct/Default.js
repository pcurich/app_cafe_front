import React,{useState, useEffect,useContext,} from 'react';

function ShoppingButtonProduct({product,increase,decrease,quantity}) {

    const {_id,long_name, price, photo} = product

    let [update, setUpdate] = useState(0);

    useEffect(() => {

      const API = async () => {
        setUpdate();
      }
      API();
      return () => {};

  }, [update]);



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
            onClick={() => decrease(_id)}
          ></i>
        </div>
        <div className="flexItem">{update}</div>
        <div className="flexItem btn btn-azul">
        <i
            className="fas fa-plus"
            onClick={() => increase(_id) }
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