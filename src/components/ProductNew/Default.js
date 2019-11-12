import React,{Fragment, useState, useEffect} from 'react';
import Swal from 'sweetalert2';
import {withRouter} from 'react-router-dom';
import axios from '../../config/axios';

function NewProduct(props) {

    //obtengo el id para saber si es un updae o un new
    const {id} = props.match.params;

    //product =state, saveProduct = function to save the stata
    const[product, saveProduct] = useState({ name:'',  price:'', photo:'' });

    //fileName =state, saveFile = function to save the stata
    const[fileName, saveFile] = useState('');

    //leer datos del formulario
    const readInfo = e =>{
        saveProduct({
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
        //redirect
        props.history.push('/');
    }
    //validate form
    const validate = ()=> {
        const {name,price} = product;
        let is_valid = !name.length || !price;
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
        
        try {
            if(id){
                product.photo = fileName.name;
                //Update
                await axios
                .put(`/products/${id}`,formData)
                .then(res => {
                    responseBG(res);
                })
            }else{
                //Insert
                await axios
                .post('/products', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then(res => {
                    responseBG(res);
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
        //Query a la API
        const API = async () => {
            const bg = await axios.get(`/products/${this.id}`);
            saveProduct(bg.data);
        }
        API();
    },[]);

    return (
        <Fragment>
        {id ? <h2>Editar Producto</h2> : <h2>Nuevo Producto</h2> }

            <form onSubmit={addProduct} >
            { id ?  
                <legend>Actualize los campos</legend> : 
                <legend>Llena todos los campos</legend>
            }

                <div className="campo">
                    <label>Nombre:</label>
                    <input 
                        type="text" 
                        placeholder="Nombre Producto" 
                        name="name" 
                        value= {product.name}
                        onChange ={readInfo}
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
                        onChange ={readInfo} 
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
                        name="imagen"                         
                        onChange ={readFile}
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
