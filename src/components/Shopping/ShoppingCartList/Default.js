import React, {useEffect, useState,useContext, Fragment} from 'react';
import axios from '../../../config/axios';
import ShoppingCardOrder from '../ShoppingCardOrder/Default';
import SummaryByDay from '../../Summary/SummaryByDay/Default';
import { CRMContext } from '../../../context/CRMContext';
import moment from "moment"

function ShoppingCard() {

    const [auth ] = useContext( CRMContext );

    const [shoppingCarts, setShoppingCarts] = useState([]);
    const [date, setDate] = useState( new Date());
    const [totalCash, setTotalCash] = useState(0);
    const [totalCredit, setTotalCredit] = useState(0);

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

            await axios.post(`/shoppingcart/${localStorage.getItem('user')}`,
                    json, { headers: headers })
                .then(res => {
                    
                    setTotalCash(0);
                    setTotalCredit(0);

                    res.data.forEach(e=>{
                        if(e.paymentType === 'Cash'){
                            console.log(totalCash + e.cash);
                            setTotalCash(totalCash + e.cash);
                        }else{
                            console.log(totalCredit + e.credit);
                            setTotalCredit(totalCredit+ e.credit);
                        }
                    })
                setShoppingCarts(res.data);
            });
        }
        API();
    }, [auth.token, date]);

    const readDateData = e => {
        setDate(moment.utc(e.target.value).add(5, 'hours').toDate());
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

        await axios.post(`/shoppingcart/${localStorage.getItem('user')}`,
                json,
                { headers: headers })
            .then(res => {
                
                setTotalCash(0);
                setTotalCredit(0);

                res.data.forEach(e=>{
                    if(e.paymentType === 'Cash'){
                        console.log(totalCash + e.cash);
                        setTotalCash(...totalCash,totalCash + e.cash);
                    }else{
                        console.log(totalCredit + e.credit);
                        setTotalCredit(...totalCredit,totalCredit+ e.credit);
                    }
                })
                // setShoppingCarts(res.data); 
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
            <p>Total Efectivo S/ {totalCash.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, 'S/1,')} | Total Tarjeta S/ {totalCredit.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, 'S/1,')} </p>

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