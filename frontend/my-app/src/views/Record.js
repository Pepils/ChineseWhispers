import React from 'react';
import './Record.css'

import Navigator from '../components/Navigator'
import AudioPlayer from '../components/AudioPlayer'
import AudioRecorder from '../components/AudioRecorder'

class Record extends React.Component {
    constructor(props) {
        super(props);
       
        this.state = {
            step: 0,
            recording: false,
            prcessing: false,
            record: {
                blob: null,
                blobURL: null
            }
        }
        this.startRecord = this.startRecord.bind(this);
    }

    componentDidMount() {
        var id = new Date().getTime();
        this.setState({
            //Setting the value of the date time
            id: id
        });
    }

    componentWillUnmount() {
        this.setState({
            step: 0
        })
    }

    startRecord() {
        this.setState({
            step: 1,
            recording: true
        })
    }

    addRecord = (data) => {
        if (data !== null) {
            this.setState({
                record: data,
                recording: false,
                processing: true
            });
        } else {
            this.setState({
                step: 0,
                recording: false
            });
        }
        this.next();
    }

    next = () => {
        const { record } = this.state;
        const { prev_id, poem_id } = this.props.history.location.state;
        if (record.blob !== null) {
            const name = "record_" + this.state.id;
            const formData = new FormData();

            formData.append("file", record.blob);
            formData.append("filepath", name);

            var request = new XMLHttpRequest();

            request.upload.addEventListener("error", () => {
                this.setState({
                    step: 0,
                    recording: false,
                    processing: false
                })
                alert("Server Error")
            });
            request.upload.addEventListener("progress", () => { console.log("Progressing ...") });
            request.upload.addEventListener("load", () => {
                this.props.history.push('/finnish')
            });

            request.open("POST", "http://localhost:5000/recordings");
            request.send(formData);
        }
    }

    render() {

        const { record, recording, step, processing } = this.state;

        

        return (
            <div className="Record">
                {processing ?
                    (
                        <h2> Processing ... </h2>
                    ) : (
                        <div >

                            {step === 0 &&
                                <div id="explanations">
                                    <p>
                                        Now it's your turn to feed the poem: you will record the next 30 seconds of the story you just heard in your native language.
                                    </p>
                                    <br />
                                    <p>
                                        You can listen again to the recording by going back.
                                    </p>
                                    <br />
                                    <p>
                                        When you are ready, click on "GO".
                                    </p>
                                </div>
                            }           
                                <div id="recording">
                                    <AudioRecorder startRecord={this.startRecord} onRecord={this.addRecord} />
                                </div>
                            <div id="listening" style={{display: "none"}}>
                                <AudioPlayer startTime={3} source={record.blobURL} />
                            </div>

                            <Navigator prev={!recording} valid={record.blob !== null ? true : false} next={() => this.next()} />
        
                        </div >
                    )
                }
            </div>
        );
    }
}

export default Record;
