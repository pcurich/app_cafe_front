import React,{Fragment, useState,useContext, useEffect} from 'react';
import Swal from 'sweetalert2';
import {withRouter} from 'react-router-dom';
import axios from '../../../config/axios';

// import el Context
import { CRMContext } from '../../../context/CRMContext';

function CreateUpdateCategory(props){

    const {id} = props.match.params;
    const [auth ] = useContext( CRMContext );
    const PATH = '/categories';

    const[category, save] = useState({
        name:'',
        photo: 'default.png',
        grouped_products:false,
        available:true,
        deleted: false
    });

    const[fileName, saveFile] = useState('');

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
        }    }

    // coloca la imagen en el state
    const readFile = e =>{
        saveFile(e.target.files[0]);
    }

    //validate form
    const validate =()=> {
        const { name } = category;
        let is_valid = !name.length;
        return is_valid;
    }

    const responseBG = res => {
        //check for monngo errors
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
        //redirect
        props.history.push('/category');
    }

    //add a new category
    const addCategory = async e => {
        e.preventDefault();
        const headerJWT = {  Authorization: `Bearer ${auth.token}` }
        const headerUpload = { 
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${auth.token}`       
        }

        //crear un formdata
        let formData = new FormData();
        formData.append('name',category.name);
        formData.append('grouped_products',category.grouped_products);
        formData.append('available',category.available);
        formData.append('photo',fileName);

        // formData.append('name','nameq');
        // formData.append('grouped_products','grouped_products');
        // formData.append('available','available');
        // formData.append('photo','photo');

        console.log("FormData = ");
        console.log(formData);

        try {
            if(id){
                category.photo = fileName.name;
                //Update
                await axios
                .put(`${PATH}/${id}`,formData,{ headers: headerJWT })
                .then(res => {  responseBG(res); })
            }else{
                console.log("INSERTANDO DATA");
                //Insert
                await axios
                //     method:'post',
                //     config: { 
                //         'Content-Type': 'multipart/form-data',
                //         Authorization : `Bearer ${auth.token}`                
                //     },
                //     url:`${PATH}`,
                //     data: formData
                // })
                .post(`${PATH}`,formData,{ headers: headerUpload })
                .then(res => { responseBG(res); })
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
                    await axios.get(`${PATH}/${id}`,{
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

    //verifica si el usuario esta autenticado o no
    if(!auth.auth && (localStorage.getItem('token')===auth.token)) {
        return props.history.push('/login')
    };


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
                        checked= {category.name}
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
                        value= {category.available}
                        onChange={updateState}
                />
            </div>

            <div className="campo">
                <label>Imagen:</label>
                {
                    category.photo ? (
                        <img src={`${process.env.REACT_APP_BACKEND_URL}/${category.photo}`} alt="imagen" width="300" />
                    ) : null
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

