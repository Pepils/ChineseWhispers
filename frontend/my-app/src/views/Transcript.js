import React from 'react';

import './Transcript.css'

import Loading from '../components/Loading'
import { Responsive, Dropdown, Grid, Input, TextArea, Form, Button, Segment } from 'semantic-ui-react'

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
            lang_id: null,
            lang: null,
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

    handleDropDown(e, option) {
        let selected = this.state.langagesOptions.find(obj => obj.value == option.value);
        this.setState({
            lang_id: selected.value,
            lang: selected.text
        })
    }

    handleSubmit(event) {
        event.preventDefault();

        if (this.state.name !== "" && this.state.transcript !== "" && this.state.lang_id) {
            this.postData();
            this.props.history.push({
                pathname: '/end',
                state: {
                    parent_id: this.state.recording ? this.state.recording.id : null,
                    poem_id: this.state.recording ? this.state.recording.poem_id : null
                }
            });
        }
            
    }

    handleOnUpdate = (e, { width }) => this.setState({ width });

    loadLangages = () => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', process.env.REACT_APP_API_URL + '/langages');
        xhr.onload = () => {
            if (xhr.readyState === xhr.DONE && xhr.status === 200) {
                let data = JSON.parse(xhr.response);
                const langagesOptions = data.map((lang, index) => ({
                    key: lang.name,
                    text: lang.name,
                    value: lang.id
                })).sort(function (a, b) {
                    var textA = a.key.toUpperCase();
                    var textB = b.key.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });

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

        const { poem_id, parent_id, recording, transcript, name, lang_id, lang } = this.state;
        const filename = name + n + '.wav';
        const formData = new FormData();

        formData.append("file", recording.blob);
        formData.append("filepath", filename);
        formData.append("name", name);
        formData.append("transcript", transcript);
        formData.append("lang_id", lang_id);
        formData.append("lang", lang);
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
            this.props.history.push('/end')
        });

        request.open("POST", process.env.REACT_APP_API_URL + "/recordings");
        request.send(formData);
    }

    render() {
        const { width, loading, langagesOptions, langage, recording } = this.state;
        const textAlign = width >= Responsive.onlyTablet.minWidth ? 'left' : 'center';

        const SoundField = () => <audio controls="controls" src={recording.blobURL} controlsList="download" />
        SoundField.defaultProps = { label: 'File' }

        return (
            <div className="Transcript">
                {loading ?
                    (
                        <Loading />
                    )
                    :
                    (
                        <div>
                            
                            <Form onSubmit={this.handleSubmit}>
                                
                                <Responsive as={Grid}
                                    columns={2}
                                    stackable
                                    container
                                    fireOnMount
                                    onUpdate={this.handleOnUpdate}
                                >
                                    <Grid.Column textAlign={textAlign}>
                                        What is your name?
                                    </Grid.Column>
                                    <Grid.Column textAlign={textAlign}>
                                        <Input name="name" placeholder="Name" type="text" value={this.state.name} onChange={this.handleChange} />
                                    </Grid.Column>
                                    <Grid.Column textAlign={textAlign}>
                                        What language did you record in?
                                    </Grid.Column>
                                    <Grid.Column textAlign={textAlign}>
                                        <Dropdown
                                            onChange={this.handleDropDown}
                                            button
                                            floating
                                            options={langagesOptions}
                                            search
                                            placeholder='Select Language'
                                            value={langage}
                                        />
                                    </Grid.Column>
                                    <Grid.Row columns={2} textAlign='justified'>
                                        Now please write the translation of what you just said. You can write in English or in French.
                                        If needed you can listen to what you've just recorded through the audio player below.
                                    </Grid.Row>
                                    <Grid.Row columns={2} container textAlign='centered'>
                                        <SoundField/>
                                    </Grid.Row>
                                    <Grid.Row columns={2} container>
                                        <TextArea placeholder="Transcript" name="transcript" value={this.state.transcript} onChange={this.handleChange} />
                                    </Grid.Row>
                                    <Grid.Row container textAlign="centered" >
                                        <Grid.Column width={2}>
                                            <Button className="btn" id="submit" type="submit" value="Submit"> Send </Button>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Responsive>
                            </Form>

                        </div>
                    )
                }
            </div>
        );
    }
}

export default Transcript;