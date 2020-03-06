import React from 'react';
import { ReactMic } from 'react-mic';
import './Recorder.css'

import Navigator from '../components/Navigator'

class Recorder extends React.Component {
    constructor(props) {
        super(props);
       
        this.state = {
            record: false,
            blob: { recordedBlob: "", blobURL: "" }
        }
    }

    startRecording = () => {
        this.setState({ record: true });
    }

    stopRecording = () => {
        this.setState({ record: false });
    }

    onData(recordedBlob) {
        console.log('chunk of real-time data is: ', recordedBlob);
    }

    onStop(recordedBlob) {
        console.log('recordedBlob is: ', recordedBlob);
        this.setState({ blob: recordedBlob })
    }

    onUpload() {
        const formData = new FormData();
        formData.append("filename", "myrecord3");
        formData.append("lang", "urdu55");
        formData.append("langfam", "urddoudou");
        formData.append("file", this.state.blob.blob);
        console.log(this.state.blob)
        var request = new XMLHttpRequest();
        request.open("POST", "http://127.0.0.1:5000/records");
        request.send(formData);
    }

    render() {
        return (
            <div>
                <ReactMic
                    record={this.state.record}
                    className="sound-wave"
                    backgroundColor="#333333"
                    visualSetting="sinewave"
                    strokeColor="#0096ef"
                    onStop={(blob) => this.onStop(blob)}
                    onData={this.onData}
                />
                <button onClick={this.startRecording} type="button">Start</button>
                <button onClick={this.stopRecording} type="button">Stop</button>
                <button onClick={() => this.onUpload()} type="button">Upload</button>

                <audio ref="audioSource" controls="controls" src={this.state.blob.blobURL} controlsList="nodownload" />

                <Navigator prev next={() => this.props.history.push('/finnish')} />
            </div>
        );
    }
}

export default Recorder;
