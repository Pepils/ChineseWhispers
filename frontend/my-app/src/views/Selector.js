import React from 'react';
import './Selector.css';
import { withRouter } from "react-router-dom";

import Navigator from '../components/Navigator'

function LangItem(props) {
    const classname = props.selected ? "LangItem selected" : "LangItem";

    return (
        <div className={classname} onClick={ () => props.handleClick( props.lang ) } >
            {props.lang}
        </div>
    );
}

class Selector extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lang: ["French", "English", "Dutch", "German", "Spanish", "Portugese", "Italian", "Polish", "Russian", "Hungarian", "Japanese", "Chinese", "Other"],
            selected: [],
        }
        this.onSelect = this.onSelect.bind(this);
        this.submit = this.submit.bind(this);
    }

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
            <LangItem
                key={i}
                lang={lang}
                selected={this.state.selected.includes(lang) === true}
                handleClick={this.onSelect}
            />
        ))

        return (
            <div className="Selector">
                <h1> Hi! Welcome to chinese Whispers </h1>
                <p>    
                    Select the languages you speak
                </p>
                <div className="lang-container">
                    {languages}
                </div>

                <p>
                    Click Next when you are done
                </p>
                <Navigator prev next={this.submit} />
            </div>
        )
    }
}


export default withRouter(Selector);
