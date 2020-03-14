import React from 'react';
import { withRouter } from 'react-router-dom';

import './Home.css';

function Home(props) {

    return (
        <div className="Home" onClick={ () => props.history.push("/selector")}>
            <h1> Chinese Whispers </h1>
            <h2> Click on the screen to start </h2>
        </div>
    );
}

export default withRouter(Home);