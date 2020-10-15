import React from 'react';

import './Finnish.css';

function Finnish(props) {

    setTimeout(() => props.history.push('/'), 15 * 1000);

    return (
        <div className="Finnish">
            <h1> Thank you for being part of this! </h1>
            <h2>
                Goodbye!
            </h2>
        </div>
    );
}

export default Finnish;