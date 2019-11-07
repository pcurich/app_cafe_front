import React, {useEffect, useState, Fragment} from 'react';
import axios from '../../config/axios';
import ShoppingCardOrder from '../ShoppingCardOrder/Default';

function ShoppingCard() {

    const [ordens, save] = useState([]);

    useEffect(() => {
        const API = async () => {
            // obtener los pedidos
            const bg = await axios.get('/shoppingcart');
            save(bg.data);
        }
        API();
    }, []);

    return (
        <Fragment>
            <h2>Pedidos</h2>

            <ul className="listado-pedidos">
                {ordens.map(order => (
                    <ShoppingCardOrder 
                        key={order._id}
                        order={order}
                    />
                ))}
            </ul>
        </Fragment>
    )
}
export default ShoppingCard;