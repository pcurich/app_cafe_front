import React,{Fragment, useState,useContext, useEffect} from 'react';
import Swal from 'sweetalert2';
import {withRouter} from 'react-router-dom';
import axios from '../../../config/axios';

// import el Context
import { CRMContext } from '../../../context/CRMContext';

function NewProduct(props) {

    //obtengo el id para saber si es un updae o un new
    const {id} = props.match.params;
    // utilizar valores del context
    const [auth ] = useContext( CRMContext );

    //product =state, save = function to save the stata
    const[product, save] = useState({
        short_name:'',  long_name:'',
        description:'', type:'',
        price: 0, cost:0,
        photo: 'default.png', available:true
    });
     // const types_id = [0,1,2]
    const types_id = [
        {id:'---------',name:'---------'},
        {id:'ToSell',name:'ToSell'},
        {id:'Material',name:'Material'}
    ]

    const updateState = e => {
        console.log(e.target.value);
        if(e.target.type === 'checkbox'){
            save({
                ...product,
                [e.target.name]: e.target.checked
            })
        }else {
            if(e.target.type==='select-one'){
                console.log(e.target.value);
                save({
                    ...product,
                    'type': e.target.value
                })
            }else{
                save({
                    ...product,
                    [e.target.name]: e.target.value
                })
            }
        }
    }

    // coloca la imagen en el state
    const readFile = async e =>{
        e.preventDefault();

        const headers = {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${auth.token}`
        };

        const formData = new FormData();
        formData.append('photo',e.target.files[0]);

        await axios.post('/upload',formData,{ headers: headers }).then(res => {
            responseBG(res);
        });
    }

	//validate form
    const validate = ()=> {
        const {long_name,price,short_name} = product;
        let is_valid = !long_name.length || !short_name.length || !price;
        return is_valid;
    }

    const responseBG = res => {
        //check for monngo errors
		if(res.status === 200){
            if(res.data){
                product.photo=res.data.fileName;
                save({
                    ...product,
                    'photo': product.photo
                })
            }
        }else{
			if(res.data.code === 11000){
            Swal.fire({
                type:'error',
                title:'Hubo un error',
                text:'Ese producto ya esta registrado'
            })
			}else{
				Swal.fire(
					`${id ? 'Se actualizo el producto': 'Se agregó el producto'}`,
					res.data.message,
					'success'
				)
			}
		}
    }

    //add a new Product
    const addProduct = async e => {
        e.preventDefault();
		const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`
        }
        //crear un formdata
        const formData = new FormData();
        formData.append('short_name',product.short_name);
        formData.append('long_name',product.long_name);
        formData.append('description',product.description);
        formData.append('type',product.type);
        formData.append('price',product.price);
        formData.append('cost',product.cost);
        formData.append('photo',product.photo);
        formData.append('available',product.available);
        formData.append('deleted',false);

        var object = {};
        formData.forEach(function(value, key){
            object[key] = value;
        });
        var json = JSON.stringify(object);

        try {
            if(id){
                //Update
                await axios
                .put(`/products/${id}`,json,{ headers: headers })
                .then(res => {
                    responseBG(res);
                    props.history.push('/product');
                })
            }else{
                //Insert
                await axios
                .post('/products',json,{ headers: headers })
                .then(res => {
                    responseBG(res);
                    props.history.push('/product');
                })
            }
        } catch (error) {
            Swal.fire({
                type:'error',
                title:'Hubo un error',
                text:'Vuelva a intentarlo'
            })
        }
    }

    //useEffect, cuando el componente carga
    useEffect(()=>{

		if(!auth.auth && (localStorage.getItem('token')===auth.token)) {
            return props.history.push('/login')
        };

		if(id){
            //Query a la API
            const API = async () => {
				await axios.get(`/products/${id}`,{
					headers: {
						Authorization : `Bearer ${auth.token}`
					}
				})
				.then(bg=> {
                    save(bg.data);
				});
            }
            API()
        };
        return () => {};
    },[auth.token, auth.auth,id,props.history]);

    return (
        <Fragment>
        {id ? <h2>Editar Producto</h2> : <h2>Nuevo Producto</h2> }

            <form onSubmit={addProduct} >
            { id ?
                <legend>Actualize los campos</legend> :
                <legend>Llena todos los campos</legend>
            }

                <div className="campo">
                    <label>Nombre Corto:</label>
                    <input
                        type="text"
                        placeholder="Nombre Corto"
                        name="short_name"
                        value= {product.short_name}
                        onChange ={updateState}
                    />
                </div>
                <div className="campo">
                    <label>Nombre Largo:</label>
                    <input
                        type="text"
                        placeholder="Nombre Largo"
                        name="long_name"
                        value= {product.long_name}
                        onChange ={updateState}
                    />
                </div>
                <div className="campo">
                    <label>Descripción:</label>
                    <textarea
                        type="text"
                        placeholder="Descripción"
                        name="description"
                        value= {product.description}
                        cols="70"
                        rows="20"
                        onChange ={updateState}
                    />
                </div>
                <div className="campo">
                    <label>Tipo:</label>
                    <select value={product.type} onChange ={updateState}>
                    {
                        types_id.map( ({name}) =>
                            <option key={name} value={name}>{name}</option>
                        )
                    }
                    </select>
                </div>
                <div className="campo">
                    <label>Precio:</label>
                    <input
                        type="number"
                        name="price"
                        min="0.00"
                        step="0.01"
                        placeholder="Precio"
                        value={product.price}
                        onChange={updateState}
                    />
                </div>
                <div className="campo">
                    <label>Costo:</label>
                    <input
                        type="number"
                        name="cost"
                        min="0.00"
                        step="0.01"
                        placeholder="Costo"
                        value={product.cost}
                        onChange={updateState}
                    />
                </div>

                <div className="campo">
                    <label>Imagen:</label>
                    {
                        product.photo ? (
                            <img src={`${process.env.REACT_APP_BACKEND_URL}/${product.photo}`} alt="imagen" width="300" />
                        ) : null
                    }
                    <input
                        type="file"
                        name="photo"
                        onChange ={readFile}
                    />
                </div>

                <div className="campo">
                <label>Disponible?</label>
                <input  type="checkbox"
                        name="available"
                        checked= {product.available}
                        onChange={updateState}
                />
            </div>

                <div className="enviar">
                    <input
                        type="submit"
                        className="btn btn-azul"
                        value= {id ? "Guardar Cambios" :"Agregar Producto" }
                        disabled = {validate()}
                    />
                </div>
            </form>
        </Fragment>
    )
}

export default withRouter(NewProduct);
