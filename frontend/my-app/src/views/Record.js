import React from 'react';
import { Grid, Segment } from 'semantic-ui-react';
import './Record.css'

import Navigator from '../components/Navigator'
import AudioPlayer from '../components/AudioPlayer'
import AudioRecorder from '../components/AudioRecorder'
import Loading from '../components/Loading'

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

            this.next();
        } else {
            this.setState({
                step: 0,
                recording: false
            });
        }
    }

    next = () => {
        const { record } = this.state;
        const { parent_id, poem_id } = this.props.history.location.state;
        if (record.blob !== null) {
            
            this.props.history.push({
                pathname: '/transcript',
                state: {
                    recording: record,
                    parent_id: parent_id,
                    poem_id: poem_id
                }
            });
        } else {
            this.props.history.push('/end')
        }
    }

    render() {

        const { record, recording, step, processing } = this.state;

        

        return (

            processing?
            (
                <Loading text = "Processing ..." />
            ): (
                <div className="Record">
                    <Grid container center colunms={2}>
                        <Grid.Column>
                            {step === 0 &&
                                <div>
                                    <Segment vertical >
                                        Now it's your turn : you will now record a brief message in your native language. Maybe you can get inspired by what you just heard.. 
                                    </Segment>
                                    <Segment vertical >
                                            When you are ready, click on "GO".
                                    </Segment>
                                </div>
                            }
                                <Segment vertical>
                                    
                                            <AudioRecorder startRecord={this.startRecord} onRecord={this.addRecord} />

                                </Segment>
                        </Grid.Column>
                    </Grid>
                    <Navigator prev={!recording} valid={record.blob !== null ? true : false} next={() => this.next()} />

                </div > 
            )
        );
    }
}

export default Record;
