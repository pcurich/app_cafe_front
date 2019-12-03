import React, {useEffect, useState, Fragment} from 'react';
import axios from '../../../config/axios';
import ShoppingCardOrder from '../ShoppingCardOrder/Default';
import SummaryByDay from '../../Summary/SummaryByDay/Default';

function ShoppingCard() {

    const [ordens, save] = useState([]);

    useEffect(() => {
        const API = async () => {
            // obtener los pedidos
            const bg = await axios.get('/shoppingcart');
            if(!bg.data){
                save(bg.data);
            };
        }
        API();
    }, []);

    return (
        <Fragment>
            <h2>Ventas</h2>
            <div className="ficha-cliente">
                <SummaryByDay></SummaryByDay>
            </div>
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