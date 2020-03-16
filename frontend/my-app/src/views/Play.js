import React from 'react';

import './Play.css'
import clip from '../resources/Jacouille_OKAY.mp3';

import Navigator from '../components/Navigator'
import AudioPlayer from '../components/AudioPlayer'
import Loading from '../components/Loading'

function random_item(items) {

    return items[Math.floor(Math.random() * items.length)];

}

class Play extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            recording: null
        }
    }

    componentDidMount() {
        this.getPoems();
    }

    getPoems = () => {
        console.log("load")
        var xhr = new XMLHttpRequest;
        xhr.open('GET', 'http://localhost:5000/recordings');

        xhr.onload = () => {
            if (xhr.readyState === xhr.DONE && xhr.status === 200) {
                let data = JSON.parse(xhr.response);
                const { selected } = this.props.history.location.state; 

                // Filter non speaked languages
                for (var i = 0; i < selected.length; i++) {
                    data = data.filter((entry) => { return entry.lang_id !== selected[i].id })
                }

                // Select a recording randomly
                var recording = random_item(data);
                this.setState({
                    loading: false,
                    recording: recording
                })
                console.log(recording)

            } else {
                alert("Server Error");
                this.props.history.push('/')
            }
        };

        xhr.addEventListener("error", () => {
            alert("Server Error");
            this.props.history.push('/')
        });

        xhr.send();
    }

    goNext = () => {
        this.props.history.push({
            pathname: '/recorder',
            state: {
                prev_id: this.state.recording ? this.state.recording.id : 0,
                poem: this.state.recording ? this.state.recording.poem_id : 0
            }
        });
    }

    render() {
        const { next, loading, recording } = this.state;
        return (
            <div className="Play">
                {loading ?
                    (
                        <Loading />
                    )
                    :
                    (
                        <div>
                            <p>
                                Now you are going to listen to a recording in a language you don't speak.
                            </p>
                            <p>
                                Put the headphones on, click "Listen" and close your eyes ...
                            </p>

                            <AudioPlayer onPlayed={() => { this.setState({ next: true }); }} source={ recording ? recording.url : clip } />

                            <Navigator prev valid={next} next={() => { this.goNext() }} />
                        </div>
                    )
                }
            </div>
        );
    }
}

export default Play;
