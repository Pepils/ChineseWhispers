import React from 'react';
import { ReactMic } from 'react-mic';
import './Player.css'

import Navigator from '../components/Navigator'

class Player extends React.Component {
    constructor(props) {
        super(props);
        let tmp = []
        if(props.location.state && props.location.state.selected){
            tmp = props.location.state.selected
        }
        this.state = {
            selected : tmp
        }
    }


    render() {

        return (
            <div>
                <audio  ref="audioSource" controls="controls" src="http://127.0.0.1:5000/files/myrecord.webm" />

                <Navigator prev next={() => this.props.history.push('/recorder')} />
            </div>
        );
    }
}

export default Player;
