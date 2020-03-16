import React from 'react';
import { withRouter } from 'react-router-dom';

import './Navigator.css';

function Navigator(props) {
    const previous = props.prev && (
        <div className="button active left" onClick={() => props.history.goBack() }> Back </div>
    );

    const next = props.next && (
        <div className={props.valid ? "button active right" : "button disabled right"} onClick={() => props.valid ? props.next() : false }> Next </div>
    );

    return (
        <div className="Navigator">
            {previous}
            {next}
            <div style={{ clear: "both" }}></div>
        </div>
    );
}

export default withRouter(Navigator);