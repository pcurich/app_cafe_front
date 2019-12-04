import React, {useEffect, useState,useContext, Fragment} from 'react';
import axios from '../../../config/axios';
import ShoppingCardOrder from '../ShoppingCardOrder/Default';
import SummaryByDay from '../../Summary/SummaryByDay/Default';
import { CRMContext } from '../../../context/CRMContext';

function ShoppingCard() {

    const [auth ] = useContext( CRMContext );

    const [shoppingCarts, setShoppingCarts] = useState([]);
    const [date, setDate] = useState( new Date());

    useEffect(() => {
        const API = async () => {
            // obtener los pedidos
            const headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.token}`
            }

            let formData = new FormData();
            formData.append('year',date.getFullYear());
            formData.append('month',date.getMonth()+1);
            formData.append('day',date.getDate());

            var object = {};
            formData.forEach(function(value, key){
                object[key] = value;
            });
            var json = JSON.stringify(object);

            console.log(date);

            await axios.post(`/shoppingcart/${localStorage.getItem('user')}`,
                    json, { headers: headers })
                .then(res => {
                console.log(res.data);
                setShoppingCarts(res.data);
            });
        }
        API();
    }, []);

    const readDateData = e => {
        setDate( e.target.value );
    }

    const searchDay = async e => {
        e.preventDefault();
        setShoppingCarts([[]]);

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`
        }

        let formData = new FormData();
        formData.append('year',date.getFullYear());
        formData.append('month',date.getMonth()+1);
        formData.append('day',date.getDate());

        var object = {};
        formData.forEach(function(value, key){
            object[key] = value;
        });
        var json = JSON.stringify(object);

        console.log(date);

        await axios.post(`/shoppingcart/${localStorage.getItem('user')}`,
                json,
                { headers: headers })
            .then(res => {
            console.log(res.data);
        });

    }

    return (
        <Fragment>
            <h2>Ventas</h2>
            <div className="ficha-cliente">
                <SummaryByDay
                    searchDay = {searchDay}
                    readDateData = {readDateData}
                ></SummaryByDay>
            </div>
            <ul className="listado-pedidos">
                {shoppingCarts.map(order => (
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