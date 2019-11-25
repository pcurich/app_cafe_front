import React,{Fragment,useState,useContext,useEffect} from 'react';
import axios from '../../../config/axios';
import { CRMContext } from '../../../context/CRMContext';

function ProductInCategoryList(props) {

    var {categoryId,refreshProducts} = props
    const[refresh, setRefresh]= useState(true);
    const [productsInCategory, setProductsInCategory] = useState([]);

    const [auth ] = useContext( CRMContext );
 
    const removeProduct = async id => {

        await axios.put(`/product-by-category/${id}`,null,{
            headers: {
                Authorization : `Bearer ${auth.token}`
            }
        }).then( ()=>{
            setRefresh(!refresh);
        });   
    }

    useEffect(()=>{
        if(!auth.auth && (localStorage.getItem('token')===auth.token)) {
            return props.history.push('/login')
        };
        //Query a la API
        const API = async () => {
            await axios.get(`/product-by-category/${categoryId}`, {
                headers: {
                    Authorization : `Bearer ${auth.token}`
                }
            })
            .then(bg=>{
                setProductsInCategory(bg.data)
            })
        }
        API(); 
        return () => {};
    },[auth.auth, auth.token, categoryId, props.history, refreshProducts,refresh]);

    return(
        <Fragment>
            <div>
                <h2>Productos en Categoria</h2>
                <ul className="responsive-table">
                    <li className="table-header">
                        <div className="col col-1">Producto</div>
                        <div className="col col-2">Precio</div>
                        <div className="col col-3">Quitar</div>
                    </li>
                    {
                    productsInCategory.map((product, index) => (
                        <li className="table-row" key={index}>
                            <div className="col col-1" data-label="Producto">({product.short_name}) - {product.long_name}</div>
                            <div className="col col-2" data-label="Precio">S/ {product.price}</div>
                            <div className="col col-3" data-label="Quitar">
                            <button
                                type="button"
                                className="btn btn-rojo"
                                onClick={() => removeProduct(product._id)}
                            >
                            <i className="fas fa-minus-circle"></i>
                            </button>
                            </div>
                        </li> 
                    ))
                    } 
                </ul>
            </div>
        </Fragment>
    )
}

export default ProductInCategoryList;