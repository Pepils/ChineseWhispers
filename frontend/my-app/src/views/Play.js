import React from 'react';
import { Grid, Segment } from 'semantic-ui-react';

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
        if (this.state.recording == null) {
            this.getPoems();
        } else {
            this.setState({
                loading: false
            })
        }
    }

    getPoems = () => {
        console.log("load")
        var xhr = new XMLHttpRequest();
        xhr.open('GET', process.env.REACT_APP_API_URL+'/recordings');

        xhr.onload = () => {
            if (xhr.readyState === xhr.DONE && xhr.status === 200) {
                let data = JSON.parse(xhr.response);
                const { selected } = this.props.history.location.state; 

                // Filter non added
                data = data.filter((entry) => { return entry.added === true })

                // Filter pending
                data = data.filter((entry) => { return entry.pending !== true })

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
            //alert("Server Error");
            //this.props.history.push('/')
            this.setState({
                loading: false,
                recording: null
            })
        });

        xhr.send();
    }

    goNext = () => {
        this.props.history.push({
            pathname: '/recorder',
            state: {
                parent_id: this.state.recording ? this.state.recording.id : null,
                poem_id: this.state.recording ? this.state.recording.poem_id : null
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
                        <div className="Play">
                            <Grid container center colunms={2}>
                                <Grid.Column>
                                    <Segment vertical >
                                        Now you are going to listen to a recording in a language you don't speak.
                                    </Segment>
                                    <Segment vertical>
                                        Put the headphones on, click "Listen" and close your eyes ...
                                    </Segment>
                                    <Segment vertical>
                                        <Grid center>
                                            <Grid.Column floated="centered" width={6}>
                                                <AudioPlayer onPlayed={() => { this.setState({ next: true }); }} source={recording ? recording.url : clip} />
                                            </Grid.Column>
                                        </Grid>
                                    </Segment>

                                </Grid.Column>
                            </Grid>
                            <Navigator prev valid={next} next={() => { this.goNext() }} />
                        </div>
                    )
                }
            </div>
        );
    }
}

export default Play;
