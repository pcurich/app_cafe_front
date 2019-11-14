import React,{Fragment, useState,useContext  } from 'react';
import Swal from 'sweetalert2';
import {withRouter} from 'react-router-dom';
import axios from '../../../config/axios';

// import el Context
import { CRMContext } from '../../../context/CRMContext';

function Dummy(props) {

  const [auth ] = useContext( CRMContext );
  // const PATH = '/dummy';
  const PATH = '/upload';

  const[dummy, save] = useState({
    name:'',
    photo: 'default.png',
    grouped_products:false,
    available:true,
    deleted: false
  });

  const[fileName, saveFile] = useState('');

  const updateState = e => {
    console.log("antes Dummy");
    console.log(
      " - name="+ dummy.name+
      " - available="+ dummy.available+
      " - deleted="+ dummy.deleted+
      " - grouped_products="+ dummy.grouped_products+
      " - photo="+ dummy.photo
      );
    if(e.target.type === 'checkbox'){
        save({
            ...dummy,
            [e.target.name]: e.target.checked
        })
    }else{
        save({
            ...dummy,
            [e.target.name]: e.target.value
        })
    }

    console.log("despues Dummy");
    console.log(
      " - name="+ dummy.name+
      " - available="+ dummy.available+
      " - deleted="+ dummy.deleted+
      " - grouped_products="+ dummy.grouped_products+
      " - photo="+ dummy.photo
      );

  }

  const readFile = async e =>{
    e.preventDefault();

    let filename = e.target.files[0]
    console.log(filename);

    saveFile(filename);

    const headers = {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${auth.token}`
    };

    const formData = new FormData();
    formData.append('photo',e.target.files[0]);

    await axios.post(`${PATH}`,formData,{ headers: headers }).then(res => {  
      responseBG(res);
    });
    // axios.post(`${PATH}`,json,{ headers: headers }).then(res => { responseBG(res); });
  }

  const responseBG = res => {
    //check for monngo errors
    console.log(res.file);

    if(res.data.code === 11000){
        Swal.fire({
            type:'error',
            title:'Hubo un error',
            text:'La categoía ya esta registrada'
        })
    }else{
        Swal.fire(
            'Se agregó la categoria',
            res.data.message,
            'success'
        )
    }
    //redirect
    //props.history.push('/category');
  }

  const addDummy = async e => {
    e.preventDefault();
    const headers = {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${auth.token}`
      // 'Content-Type': 'application/json'
    }


    const formData = new FormData();
    formData.append('name',dummy.name);
    formData.append('grouped_products',dummy.grouped_products);
    formData.append('available',dummy.available);
    formData.append('photo',fileName);

    var object = {};
    formData.forEach(function(value, key){
        object[key] = value;
    });
    //var json = JSON.stringify(object);

    await axios.post(`${PATH}`,formData,{ headers: headers }).then(res => { responseBG(res); })

  }

  return (
    <Fragment>
      <h2>Editar Categoria</h2>

      <form onSubmit={addDummy}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Título:</label>
          <input
            type="text"
            placeholder="Nombre para la  Categoria"
            name="name"
            checked={dummy.name}
            onChange={updateState}
          />
        </div>

        <div className="campo">
          <label>Productos Agrupados?:</label>
          <input
            type="checkbox"
            name="grouped_products"
            checked={dummy.grouped_products}
            onChange={updateState}
          />
        </div>

        <div className="campo">
          <label>Disponible?</label>
          <input
            type="checkbox"
            name="available"
            value={dummy.available}
            onChange={updateState}
          />
        </div>

        <div className="campo">
          <label>Imagen:</label>
          {dummy.photo ? (
            <img
              src={`${process.env.REACT_APP_BACKEND_URL}/${dummy.photo}`}
              alt="imagen"
              width="300"
            />
          ) : null}
          <input type="file" name="imagen" onChange={readFile} />
        </div>
        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value= "Agregar"
          />
        </div>
      </form>
    </Fragment>
  );
}

// HOC, es una funcion que toma un componente y retorna un nuevo componenete
export default withRouter(Dummy);
