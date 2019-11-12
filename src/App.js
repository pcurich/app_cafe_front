import React,{ Fragment,useContext } from "react";

/** Routing */
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

/** Layout */
import Header from './components/layout/Header';
import Nav from './components/layout/Nav';

/** Components */
import Customers from './components/CustomerList/Default'
import NewCustomer from './components/CustomerNew/Default'

import Categories from './components/Category/CategoryList/Default'
import CategoryCreateUpdate from './components/Category/CategoryCreateUpdate/Default'

import Products from './components/ProductList/Default'
import NewProduct from './components/ProductNew/Default'

import ShoppingCarts from './components/ShoppingCartList/Default'
import NewShoppingCart from './components/ShoppingCartNew/Default'

import { CRMContext, CRMProvider } from './context/CRMContext';

import Login from './components/Auth/Login/Default'

function App(){
  // utilizar context en el componente
  const [ auth, saveAuth ] = useContext(CRMContext);
  
  return (
    <Router>
      <Fragment>
        <CRMProvider value={[ auth, saveAuth ]}>
        <Header/>
        <div className="grid contenedor contenido-principal">
          <Nav/>
          
          <main className="caja-contenido col-9">
            <Switch>
              <Route exact path="/" component={Customers} />
              <Route exact path="/category" component={Categories}/>
              <Route exact path="/category/new" component={CategoryCreateUpdate}/>

              <Route exact path="/customer/new" component={NewCustomer} />
              <Route exact path="/customer/edit/:id" component={NewCustomer} />

              <Route exact path="/product" component={Products} />
              <Route exact path="/product/new" component={NewProduct} />
              <Route exact path="/product/edit/:id" component={NewProduct} />

              <Route exact path="/shoppingCart" component={ShoppingCarts} />
              <Route exact path="/shoppingCart/new/:id" component={NewShoppingCart} />

              <Route exact path="/login" component={Login} />
              
            </Switch>
          </main>
        </div>
        </CRMProvider>
      </Fragment>
    </Router>
  )
}

export default App;