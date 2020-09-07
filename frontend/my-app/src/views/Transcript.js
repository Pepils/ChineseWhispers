import React from 'react';

import './Transcript.css'
import 'semantic-ui-css/semantic.min.css'

import Loading from '../components/Loading'
import { Dropdown, Grid, Input, TextArea, Form, Button} from 'semantic-ui-react'


class Transcript extends React.Component {
    constructor(props) {
        super(props);

        const { poem_id, parent_id, recording } = this.props.history.location.state;

        this.state = {
            loading: true,
            recording: recording,
            poem_id: poem_id,
            parent_id: parent_id,
            name: "",
            transcript: "",
            langage: null,
            langagesOptions: null
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleDropDown = this.handleDropDown.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if (this.state.recording == null) {
            alert("Server Error");
            this.props.history.push('/')
        }
        this.loadLangages();
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleDropDown(e, { value }) {
        this.setState({ langage: value })
    }

    handleSubmit(event) {
        event.preventDefault();

        if (this.state.name !== "" && this.state.transcript !== "" && this.state.langage) {
            this.postData();
            this.props.history.push({
                pathname: '/finnish',
                state: {
                    parent_id: this.state.recording ? this.state.recording.id : null,
                    poem_id: this.state.recording ? this.state.recording.poem_id : null
                }
            });
        }
            
    }

    loadLangages = () => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', process.env.REACT_APP_API_URL + '/langages');
        xhr.onload = () => {
            if (xhr.readyState === xhr.DONE && xhr.status === 200) {
                let data = JSON.parse(xhr.response);
                const langagesOptions = data.map((lang, index) => ({
                    key: lang.name,
                    text: lang.name,
                    value: lang.name
                }));

                this.setState({
                    loading: false,
                    langagesOptions: langagesOptions
                });
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

    postData = () => {
        var d = new Date();
        var n = d.getTime();

        const { poem_id, parent_id, recording, transcript, name, langage } = this.state;
        const filename = name + n;
        const formData = new FormData();

        formData.append("file", recording.blob);
        formData.append("filepath", filename);
        formData.append("name", name);
        formData.append("transcript", transcript);
        formData.append("lang", langage);
        if (poem_id != null) {
            formData.append("poem_id", poem_id);
        }
        if (parent_id != null) {
            formData.append("parent_id", parent_id);
        }

        var request = new XMLHttpRequest();
        request.upload.addEventListener("error", () => {
            this.setState({
                step: 0,
                recording: false,
                processing: false
            })
            alert("Server Error")
            this.props.history.push('/error')
        });
        request.upload.addEventListener("progress", () => { console.log("Progressing ...") });
        request.upload.addEventListener("load", () => {
            this.props.history.push('/finnish')
        });

        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        //request.open("POST", process.env.REACT_APP_API_URL + "/recordings");
        //request.send(formData);
    }

    render() {
        const { loading, langagesOptions, langage } = this.state;

        return (
            <div className="Transcript">
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
                            <Form onSubmit={this.handleSubmit}>
                                <Grid columns={2}>
                                    <Grid.Column>
                                        <Input name="name" placeholder="Name" type="text" value={this.state.name} onChange={this.handleChange} />
                                    </Grid.Column>
                                    <Grid.Column>
                                        <label>
                                            Langage:
                                            <Dropdown
                                                onChange={this.handleDropDown}
                                                button
                                                floating
                                                labeled
                                                options={langagesOptions}
                                                search
                                                placeholder='Select Language'
                                                value={langage}
                                            />
                                        </label>

                                    </Grid.Column>
                                </Grid>
                                <Grid columns={1}>
                                    <Grid.Column>
                                        <label>
                                            Transcript:
                                        <TextArea placeholder="Transcript" name="transcript" value={this.state.transcript} onChange={this.handleChange} />
                                        </label>
                                    </Grid.Column>
                                </Grid>
                                <Grid columns={1}>
                                    <Grid.Column>
                                        <Button type="submit" value="Submit"> Send </Button>
                                    </Grid.Column>
                                </Grid>
                            </Form>

                        </div>
                    )
                }
            </div>
        );
    }
}

export default Transcript;