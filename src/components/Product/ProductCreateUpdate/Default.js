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
        short_name:'',
        long_name:'',
        description:'',
        type:'',
        price: 0,
        cost:0,
        photo:'',
        available:true
    });

    //fileName =state, saveFile = function to save the stata
    const[fileName, saveFile] = useState('');

    //leer datos del formulario
    const updateState = e =>{
        save({
            //obtener una copia del state y agregar el nuevo
            ...product,
            [e.target.name]: e.target.value
        })
    }

    // coloca la imagen en el state
    const readFile = e =>{
        saveFile(e.target.files[0]);
        product.photo = '';
    }

    const responseBG = res => {
        //check for monngo errors
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
    //validate form
    const validate = ()=> {
        const {long_name,price} = product;
        let is_valid = !long_name.length || !price;
        return is_valid;
    }

    //add a new Product
    const addProduct = async e => {
        e.preventDefault();

        //crear un formdata
        const formData = new FormData();
        formData.append('name',product.name);
        formData.append('price',product.price);
        formData.append('photo',fileName);

        console.log(formData);

        try {
            if(id){
                product.photo = fileName.name;
                //Update
                await axios
                .put(`/products/${id}`,{
                    headers: {
                        Authorization : `Bearer ${auth.token}`
                    }
                },formData)
                .then(res => {
                    responseBG(res);
                    //redirect
                    props.history.push('/product');
                })
            }else{
                //Insert
                await axios
                .post('/products', formData, {
                    headers: {
                        Authorization : `Bearer ${auth.token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then(res => {
                    responseBG(res);
                    //redirect
                    props.history.push('/product');
                })
            }
        } catch (error) {
            //console.log(error);
            //lanzar alerta
            Swal.fire({
                type:'error',
                title:'Hubo un error',
                text:'Vuelva a intentarlo'
            })
        }
    }

    //useEffect, cuando el componente carga
    useEffect(()=>{

            let isSubscribed = true;

            if(id){
                //Query a la API
                const API = async () => {
                    if (isSubscribed) {
                        await axios.get(`/products/${id}`,{
                            headers: {
                                Authorization : `Bearer ${auth.token}`
                            }
                        })
                        .then(bg=>isSubscribed ? save(bg.data):null);
                    }
                }
                API()
            };
            return () => (isSubscribed = false);
    },[auth.token, id]);

    return (
        <Fragment>
        {id ? <h2>Editar Producto</h2> : <h2>Nuevo Producto</h2> }

            <form onSubmit={addProduct} >
            { id ?
                <legend>Actualize los campos</legend> :
                <legend>Llena todos los campos</legend>
            }

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
                    <input
                        type="text"
                        placeholder="Descripción"
                        name="description"
                        value= {product.description}
                        onChange ={updateState}
                    />
                </div>
                <div className="campo">
                    <label>Tipo:</label>
                    <input
                        type="text"
                        placeholder="Tipo"
                        name="type"
                        value= {product.type}
                        onChange ={updateState}
                    />
                </div> 
                <div className="campo">
                    <label>Precio:</label>
                    <input
                        type="number"
                        name="price"
                        min="0.00"
                        step="0.1"
                        placeholder="Precio"
                        value= {product.price}
                        onChange ={updateState}
                    />
                </div>
                <div className="campo">
                    <label>Precio:</label>
                    <input
                        type="number"
                        name="cost"
                        min="0.00"
                        step="0.1"
                        placeholder="Costo"
                        value= {product.cost}
                        onChange ={updateState}
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
