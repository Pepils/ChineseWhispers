import React from 'react';

import './AudioRecorder.css';

import { ReactMic } from 'react-mic';

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
                    onStop={(blob) => this.onStop(blob)}
                />
                <div className={recording ? "button selected" : "button active"} onClick={() => { recording ? this.stopRecording() : this.startRecording() }} > {recording ? "Stop" : "GO!"} </div>
            </div>
        );
    }
}

export default AudioRecorder;