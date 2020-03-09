import React from 'react';

import './Play.css'

import Navigator from '../components/Navigator'
import AudioPlayer from '../components/AudioPlayer'

class Play extends React.Component {
    constructor(props) {
        super(props);
        let tmp = []
        if(props.location.state && props.location.state.selected){
            tmp = props.location.state.selected
        }
        this.state = {
            selected: tmp
        }
    }

    enableNext = () => {
        
    }

    render() {
        const { next } = this.state;
        return (
            <div className="Play">
                <p>
                    Put the headphones on, click on "Play" and close your eyes ...
                </p>

                <AudioPlayer onPlayed={() => { this.setState({ next: true }); }} source="https://archive.org/download/deepx010mix/deepx010M-01_-_Various_-_Deep-X_Vol.2_The_Mix__Mixed_By_AY_.mp3"/>

                <p>
                    Now it's your turn to record in your nature language !
                </p>
                <Navigator prev valid={next} next={() => this.props.history.push('/recorder')} />
            </div>
        );
    }
}

export default Play;
