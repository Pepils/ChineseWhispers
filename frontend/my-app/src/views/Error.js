import React from 'react';
import { withRouter } from 'react-router-dom';

import './Error.css';

function Error(props) {

    return (
        <div className="Error">
            <h1> Error </h1>
            <h2> Unkown Error </h2>
        </div>
    );
}

export default withRouter(Error);