import React,{ useContext, Fragment} from 'react';

import { withRouter} from 'react-router-dom'

// import el Context
import { CRMContext } from '../../context/CRMContext';


function Home(props) {

    // utilizar valores del context
    const [auth ] = useContext( CRMContext );

    if(!auth.auth) {
        props.history.push('/login');
    }


    return (
        <Fragment>
            <p></p>
        </Fragment>
    )
}
export default withRouter(Home);