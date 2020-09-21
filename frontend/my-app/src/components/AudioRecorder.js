import React from 'react';
import { Grid, Button } from 'semantic-ui-react';
import { ReactMic } from 'react-mic';

import './AudioRecorder.css';


class AudioRecorder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            recording: false,
            preamb: true,
            blob: {
                recordedBlob: "",
                blobURL: null
            },
            counter: 3
        }
        this.countDown = this.countDown.bind(this);
    }

    componentWillUnmount() {
        clearTimeout(this.timerActivity);
        this.setState({
            recording: false
        });
    }

    countDown () {
        let count = this.state.counter - 1;
        if (count > 0) {
            this.setState({
                counter: count
            });
            this.activityTimer = setTimeout(this.countDown, 1 * 1000);
        } else {
            this.setState({
                preamb: false
            });

        }
    }

    startRecording = () => {
        if (this.props.startRecord)
            this.props.startRecord();

        this.activityTimer = setTimeout(this.countDown, 1 * 1000);

        this.setState({
            recording: true,
            preamb: true,
            counter: 3
        });

    }

    stopRecording = () => {
        this.setState({
            recording: false
        });
    }

    onStop(recordedBlob) {
        if (this.state.preamb)
            this.props.onRecord(null);
        else
            this.props.onRecord(recordedBlob);
    }

    render() {
        const { recording, preamb, counter } = this.state;

        return (
            <div className="AudioRecorder">
                <Grid center>
                    <Grid.Column floated="centered">
                        {recording && preamb &&
                            <div className="counter">
                                {counter}
                            </div>
                        }
                
                        <ReactMic
                            record={recording}
                            className={(recording && !preamb) ? "sound-wave" : "sound-wave hide"}
                            backgroundColor="#000000"
                            visualSetting={"sinewave"}
                            strokeColor="#ffffff"
                            mimeType="audio/wav"
                            onStop={(blob) => this.onStop(blob)}
                        />
                    </Grid.Column>
                </Grid>
                <Grid center>
                    <Grid.Column floated="centered" width={6}>
                        <Button className={recording ? "btn selected" : "btn active"} onClick={() => { recording ? this.stopRecording() : this.startRecording() }} > {recording ? "Stop" : "GO!"} </Button>
                    </Grid.Column>
                </Grid>
            </div>
        );
    }
}

export default AudioRecorder;