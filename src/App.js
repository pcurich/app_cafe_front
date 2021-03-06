import React,{ Fragment,useContext } from "react";

/** Routing */
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

/** Layout */
import Header from './components/layout/Header';
import Nav from './components/layout/Nav';

/** Components */
import Customers from './components/Customer/CustomerList/Default'
import NewCustomer from './components/Customer/CustomerCreateUpdate/Default'

import Categories from './components/Category/CategoryList/Default'
import CategoryCreateUpdate from './components/Category/CategoryCreateUpdate/Default'
import CategoryProduct from './components/Category/CategoryProduct/Default'
import Products from './components/Product/ProductList/Default'
import NewProduct from './components/Product/ProductCreateUpdate/Default'

import ShoppingCarts from './components/Shopping/ShoppingCartList/Default'
import NewShoppingCart from './components/Shopping/ShoppingCartNew/Default'

import SummaryByDay from './components/Summary/SummaryByDay/Default'

import { CRMContext, CRMProvider } from './context/CRMContext';

import Login from './components/Auth/Login/Default'
import CreateUser from './components/Auth/Create/Default'
import Home from './components/Home/Default'

import Dummy from './components/Dummy/DummyPost/Default'

function App(){
  // utilizar context en el componente
  const [ auth, saveAuth ] = useContext(CRMContext);
  console.log(React.version);
  return (
    <Router>
      <Fragment>
        <CRMProvider value={[ auth, saveAuth ]}>
        <Header/>
        <div className="grid contenedor contenido-principal">
          <Nav/>

          <main className="caja-contenido col-10">
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/category" component={Categories}/>
              <Route exact path="/category/new" component={CategoryCreateUpdate}/>
              <Route exact path="/category/product/:id/:category" component={CategoryProduct}/>

              <Route exact path="/category/edit/:id" component={CategoryCreateUpdate}/>

              <Route exact path="/customer" component={Customers} />
              <Route exact path="/customer/new" component={NewCustomer} />
              <Route exact path="/customer/edit/:id" component={NewCustomer} />

              <Route exact path="/product" component={Products} />
              <Route exact path="/product/new" component={NewProduct} />
              <Route exact path="/product/edit/:id" component={NewProduct} />

              <Route exact path="/shoppingCarts" component={ShoppingCarts} />
              <Route exact path="/shoppingCart/new" component={NewShoppingCart} />
              <Route exact path="/shoppingCart/new/:id" component={NewShoppingCart} />

              <Route exact path="/login" component={Login} />
              <Route exact path="/newUser" component={CreateUser} />

              <Route exact path="/dummy" component={Dummy} />

            </Switch>
          </main>
        </div>
        </CRMProvider>
      </Fragment>
    </Router>
  )
}

export default App;