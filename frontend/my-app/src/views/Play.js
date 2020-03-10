import React from 'react';

import './Play.css'
import clip from '../resources/Jacouille_OKAY.mp3';

import Navigator from '../components/Navigator'
import AudioPlayer from '../components/AudioPlayer'

class Play extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

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

                <AudioPlayer onPlayed={() => { this.setState({ next: true }); }} source={clip}/>

                <p>
                    Now it's your turn to record in your nature language !
                </p>
                <Navigator prev valid={next} next={() => this.props.history.push('/recorder')} />
            </div>
        );
    }
}

export default Play;
