import React from 'react';
import { withRouter } from 'react-router-dom';

import './Navigator.css';

function Navigator(props) {
    const previous = props.prev && (
        <div className="button red left" onClick={() => props.history.goBack()}> Back </div>
    );

    const next = props.next && (
        <div className="button green right" onClick={() => props.next() }> Next </div>
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