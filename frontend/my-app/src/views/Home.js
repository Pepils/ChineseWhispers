import React from 'react';
import { withRouter } from 'react-router-dom';

import './Home.css';

function Home(props) {

    return (
        <div className="Home" onClick={ () => props.history.push("/selector")}>
            <h1> Chinese Whispers </h1>
            <p> Put a logo here? </p>
        </div>
    );
}

export default withRouter(Home);