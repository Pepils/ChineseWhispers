import React from 'react';
import './App.css';
import {Link} from "react-router-dom";

class Selector extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lang: ["french", "english", "dutch", "german", "spanish"],
            selected: [],
        }
    }

    onSelect(e, lang) {
        this.setState((state) => {
            if (state.selected.includes(lang)) {
                return {
                selected: [...state.selected].filter(item => item !== lang)
                };
            }
            else { // append [...new Set([...state.selected, lang])]
                return {
                    selected: [...state.selected, lang]
                };
            }

        });
    }

    render() {
        let langlist;
        langlist = (
            this.state.lang.map( (lang, index) => {
                let bkg = "#73bef0";
                if(this.state.selected.includes(lang)){
                    bkg= "#03fc9d"
                }
                return(
                    <div className="box" style={{backgroundColor:bkg}} key={index} onClick={(e) => this.onSelect(e, lang)}>
                        <p>{lang}</p>
                    </div>
                )
                }
            )
        )
        let text=""
        if(this.state.selected.length > 0){
            text = "Selected languages :"
        }

        return (
            <React.Fragment>
                {langlist}
                <br/>
                {text}
                {this.state.selected.map((item,ix) =>{return <li key={ix}>{item}</li>})}
            <Link to="/"> Next </Link>
            </React.Fragment>
        )
    }
}

export default Selector;
