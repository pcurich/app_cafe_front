import React,{useEffect, useState, useContext, Fragment} from 'react';
import axios from '../../../config/axios';
import {Link, withRouter} from 'react-router-dom'

import { CRMContext } from '../../../context/CRMContext';

import Category from '../CategoryBlock/Default'
import Product from '../../Product/ProductBlock/Default'

function CategoryProduct(props) {


  var style = {
    'backgroundColor':'Red'
  }

  return (
    <Fragment>
      <div className="caja-contenido col-3">
          <h2 style={style}>Categoria Elegida</h2>
      </div>
      <div className="col-9">
        buscador mas tabla
      </div>
    </Fragment>
  )
}

export default withRouter(CategoryProduct);