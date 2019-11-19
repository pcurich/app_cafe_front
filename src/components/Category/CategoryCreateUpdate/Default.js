import React,{Fragment, useState,useContext, useEffect} from 'react';
import Swal from 'sweetalert2';
import {withRouter} from 'react-router-dom';
import axios from '../../../config/axios';

// import el Context
import { CRMContext } from '../../../context/CRMContext';

function CreateUpdateCategory(props){

    const {id} = props.match.params;
    const [auth ] = useContext( CRMContext );

    const[category, save] = useState({
        name:'',
        photo: 'default.png',
        grouped_products:false,
        available:true,
        deleted: false
    });

    const updateState = e => {
        if(e.target.type === 'checkbox'){
            save({
                ...category,
                [e.target.name]: e.target.checked
            })
        }else{
            save({
                ...category,
                [e.target.name]: e.target.value
            })
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
    const validate =()=> {
        const { name } = category;
        let is_valid = !name.length;
        return is_valid;
    }

    const responseBG = res => {
        //check for monngo errors
        if(res.status === 200){
            if(res.data){
                category.photo=res.data.fileName;
                save({
                    ...category,
                    'photo': category.photo
                })
            }
        }else{
            if(res.data.code === 11000){
                Swal.fire({
                    type:'error',
                    title:'Hubo un error',
                    text:'La categoía ya esta registrada'
                })
            }else{
                Swal.fire(
                    `${id ? 'Se actualizo la categoria': 'Se agregó la categoria'}`,
                    res.data.message,
                    'success'
                )
            }
        }
    }

    //add a new category
    const addCategory = async e => {
        e.preventDefault();

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.token}`
        }

        let formData = new FormData();
        formData.append('name',category.name);
        formData.append('grouped_products',category.grouped_products);
        formData.append('available',category.available);
        formData.append('photo',category.photo);

        var object = {};
        formData.forEach(function(value, key){
            object[key] = value;
        });
        var json = JSON.stringify(object);

        try {
            if(id){
                //Update
                await axios
                .put(`/categories/${id}`,json,{ headers: headers })
                .then(res => {
                    responseBG(res);
                    props.history.push('/category');
                })
            }else{
                //Insert
                await axios.post('/categories',json,{ headers: headers })
                .then(res => {
                    responseBG(res);
                    props.history.push('/category');
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
                await axios.get(`/categories/${id}`,{
                    headers: {
                        Authorization : `Bearer ${auth.token}`
                    }
                })
                .then(bg=>{
                    save(bg.data)
                })
            }
            API();
        };
        return () => {};
    },[auth.token, auth.auth, id,props.history]);

    return (
        <Fragment>
            {id ? <h2>Editar Categoria</h2> : <h2>Nueva Categoria</h2> }

            <form onSubmit={addCategory} >
            { id ?
                <legend>Actualize los campos</legend> :
                <legend>Llena todos los campos</legend>
            }

            <div className="campo">
                <label>Título:</label>
                <input  type="text"
                        placeholder="Nombre para la  Categoria"
                        name="name"
                        value= {category.name}
                        onChange={updateState}
                />
            </div>

            <div className="campo">
                <label>Productos Agrupados?:</label>
                <input  type="checkbox"
                        name="grouped_products"
                        checked= {category.grouped_products}
                        onChange={updateState}
                />
            </div>

            <div className="campo">
                <label>Disponible?</label>
                <input  type="checkbox"
                        name="available"
                        checked= {category.available}
                        onChange={updateState}
                />
            </div>

            <div className="campo">
                <label>Imagen:</label>
                {
                    category.photo ? (
                        <img src={`${process.env.REACT_APP_BACKEND_URL}/${category.photo}`} alt="imagen" width="300" />
                    ) : category.photo
                }
                <input
                    type="file"
                    name="imagen"
                    onChange ={readFile}
                />
            </div>
            <div className="enviar">
                <input  type="submit"
                        className="btn btn-azul"
                        value= {id ? "Guardar Cambios" :"Agregar Categoria" }
                        disabled = {validate()}
                />
            </div>

            </form>
        </Fragment>
    );
}

// HOC, es una funcion que toma un componente y retorna un nuevo componenete
export default withRouter(CreateUpdateCategory);

