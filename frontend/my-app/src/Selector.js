import React from 'react';
import './App.css';

class Selector extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            lang: ["french", "english", "dutch", "german", "spanish"],
            selected: [],
        }
    }
    
    onSelect(e, lang) {
        this.setState((state, lang) => {
            return {
                selected: [...state.selected, lang]
            };
        });
    }

    render() {
        let langlist;
        langlist = (
            this.state.lang.map( (lang, index) => {
                return(
                    <div className=box key={index} onClick={(e) => this.onSelect(e, lang)}
                        {lang}
                    </div>
                )
                }
            )
        )

        return (
            <React.Fragment>
                {langlist}
            </React.Fragment>
        )
    }
}

export default Selector;

