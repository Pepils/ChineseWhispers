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
                step: 2,
                recording: false
            });
        } else {
            this.setState({
                step: 0,
                recording: false
            });
        }

    }

    next = () => {
        const { record } = this.state;
        if (record.blob !== null) {
            const name = "record_" + this.state.id;
            console.log(name)
            const formData = new FormData();
            formData.append("filename", name);
            formData.append("lang", "urdu55");
            formData.append("langfam", "urddoudou");
            formData.append("file", record.blob);
            formData.append("transcript", "");
            formData.append("name", "");

            console.log(record);

            var request = new XMLHttpRequest();

            request.upload.addEventListener("progress", () => { console.log("Progressing ...") });
            request.upload.addEventListener("loadend", () => {
                this.props.history.push('/finnish')
            });

            request.open("POST", "http://localhost:5000/recordings");
            request.send(formData);
        }
    }

    render() {

        const { record, recording, step } = this.state;

        

        return (

            <div className="Record">

                {step === 0 &&
                    <div id="explanations">
                        <p>
                            Inspired by the extract you just heard, it is your turn to feed the poem. You can listend to it again at any time.
                        </p>
                        <br />
                        <p>
                            When you are ready, click on "GO".
                        </p>
                        <br />
                        <p>
                            You will have 30 seconds to record what you have to say.
                        </p>
                    </div>
                }
                {step === 2 &&
                    <div id="explanations">
                        <p>
                            Well done !
                        </p>
                        <br />
                        <p>
                            You can listen back to your recording. If it is ok for you, go "Next"
                        </p>
                        <br />
                        <p>
                            Or if you're not satisfied, try again by clicking "GO"
                        </p>
                    </div>
                }
                <div id="recording">
                    <AudioRecorder startRecord={this.startRecord} onRecord={this.addRecord} />
                </div>
                
                <div id="listening">
                    <AudioPlayer startTime={3} source={record.blobURL} />
                </div>

                <Navigator prev={!recording} valid={record.blob !== null ? true : false} next={() => this.next()} />

        
            </div>
        );
    }
}

export default Record;
