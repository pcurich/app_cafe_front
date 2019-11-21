import React from 'react';

function ShoppingButtonCategory(props) {

    const {category} = props.category

    return(
        <div>
            <button type = "submit" name = "learn" value = "myimage">
                <p>{category.name}
                    <img src="https://www.tutorialspoint.com/latest/inter-process-communication.png" alt="imagen" height="60" width="60"  />
                </p>
            </button>
        </div>
    )
}

export default ShoppingButtonCategory;