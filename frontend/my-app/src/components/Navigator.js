import React from 'react';
import { withRouter } from 'react-router-dom';
import { Grid, Segment, Button } from 'semantic-ui-react';

import './Navigator.css';

function Navigator(props) {
    const previous = props.prev && (
        <Button className="btn active left" onClick={() => props.history.goBack() }> Back </Button>
    );

    const next = props.next && (
        <Button className={props.valid ? "btn active right" : "btn disabled right"} onClick={() => props.valid ? props.next() : false }> Next </Button>
    );

    return (
        <div className="Navigator">
            <Grid columns={6}>
                <Grid.Column floated='left' width={4}>
                    {previous}
                </Grid.Column>
                
                <Grid.Column floated='right' width={4}>  
                    {next}
                </Grid.Column>

            </Grid>
            <div style={{ clear: "both" }}></div>
        </div>
    );
}

export default withRouter(Navigator);