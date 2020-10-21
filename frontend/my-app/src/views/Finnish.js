import React from 'react';

import './Finnish.css';

function Finnish(props) {

    setTimeout(() => props.history.push('/'), 15 * 1000);

    return (
        <div className="Finnish">
            <h1> Thank you ! </h1>
        </div>
    );
}

export default Finnish;