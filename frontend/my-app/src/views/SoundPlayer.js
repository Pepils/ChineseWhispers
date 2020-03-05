import React from 'react';
import { ReactMic } from 'react-mic';
import './SoundPlayer.css'
import {Link} from "react-router-dom";

class SoundPlayer extends React.Component {
  constructor(props) {
    super(props);
    let tmp = []
    if(props.location.state && props.location.state.selected){
        tmp = props.location.state.selected
    }
    this.state = {
      record: false,
      blob: {recordedBlob:"", blobURL: ""},
      selected : tmp
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
    this.setState({blob: recordedBlob})
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
      let text=""
      if(this.state.selected.length > 0){
          text = "Selected languages :"
      }
    return (
      <div>
        {text}
        {this.state.selected.map((item,ix) =>{return <li key={ix}>{item}</li>})}
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
        <br/>
        <audio ref="audioSource" controls="" src={this.state.blob.blobURL} controlsList="nodownload"/>
        <br/>
        <audio  ref="audioSource" controls="controls" src="http://127.0.0.1:5000/files/myrecord.webm" />
        <br/>
        <Link to="/selector">Next</Link>
      </div>
    );
  }
}

export default SoundPlayer;
//export Soundplayer;
