import React from 'react';
import './Selector.css';
import { withRouter } from "react-router-dom";
import { Header, Grid, Input, TextArea, Form, Button, Segment } from 'semantic-ui-react'

import Navigator from '../components/Navigator'
import Loading from '../components/Loading'

function LangItem(props) {
    const classname = props.selected ? "btn selected" : "btn active";

    return (
        <Button className={classname} onClick={ () => props.handleClick( props.lang ) } >
            {props.lang.name}
        </Button>
    );
}

class Selector extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lang: [],
            selected: [],
            loading: true
        }
        this.onSelect = this.onSelect.bind(this);
        this.submit = this.submit.bind(this);

    }

    componentDidMount() {
        console.log("load")
        var xhr = new XMLHttpRequest();
        xhr.open('GET', process.env.REACT_APP_API_URL +'/langages');

        xhr.onload = () => {
            if (xhr.readyState === xhr.DONE && xhr.status === 200) {
                let data = JSON.parse(xhr.response);
                var lang = [];
                for (var i = 0; i < data.length; i++) {
                    lang.push(data[i]);
                }

                lang.sort(function (a, b) {
                    var textA = a.name.toUpperCase();
                    var textB = b.name.toUpperCase();
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });

                console.log(lang)

                this.setState({
                    loading: false,
                    lang: lang
                });
            } else {
                alert("Server Error");
                this.props.history.push('/')
            }
        };

        xhr.addEventListener("error", () => {
            //alert("Server Error");
            //this.props.history.push('/')
            this.setState({
                lang: [
                    { id: 1, name: "French" },
                    { id: 2, name: "English" },
                    { id: 3, name: "Dutch" },
                    { id: 4, name: "Spanish" },
                    { id: 5, name: "Italian" },
                    { id: 6, name: "German" },
                    { id: 7, name: "Portuese" },
                    { id: 8, name: "Hungarian" },
                    { id: 9, name: "Japanese" },
                    { id: 10, name: "Chinese" },
                    { id: 11, name: "Other" }
                ],
                loading: false
            })
        });

        xhr.send();
    };

    onSelect(lang) {
        console.log(lang);

        const selected = this.state.selected.includes(lang) ? this.state.selected.filter(item => item !== lang) : [...this.state.selected, lang];

        this.setState({
            selected: selected
        });
    }

    submit() {
        this.props.history.push({
            pathname: '/player',
            state: {
                selected: this.state.selected
            }
        });
    }

    render() {

        const languages = this.state.lang.map((lang, i) => (
            <Grid.Column>
            <LangItem
                key={i}
                lang={lang}
                selected={this.state.selected.includes(lang) === true}
                handleClick={this.onSelect}
                />
            </Grid.Column>
        ))
        if (this.state.loading) {
            return (
                <Loading />
            );
        } else {
            return (
                <div className="Selector">
                    <Grid container centered columns={1}>
                        <Grid.Column textAlign="center" >
                            <Header as="h1"> Hi! Welcome to Chinese Whispers </Header>
                        </Grid.Column>
                        <Grid.Column textAlign="center">
                            <Segment>
                                This is an interactive installation. Please select the languages you speak.
                            </Segment>
                        </Grid.Column>
                    </Grid>
                    <Grid container columns={6} doubling>
                        {languages}
                    </Grid>

                    <Navigator next={this.submit} valid={this.state.selected.length > 0} />
                </div>
            )
        }
    }
}


export default withRouter(Selector);
