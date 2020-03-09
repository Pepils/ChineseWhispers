import React from 'react';

class Visu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            poems: [],
        }
    }

    componentDidMount() {
        this.timer = setTimeout(this.getPoems, 2000)
    }
    
    componentWillUnmount() {
        clearTimeout(this.timer)
        this.timer = null 
    }

    getPoems = () => {
        fetch("http://127.0.0.1:5000/recordings")
            .then(result => result.json())
            .then(result => this.setState({ poems: result }))
        this.timer = setTimeout(this.getPoems, 2000)
    }

    render() {
        let poemlist = (
            <React.Fragment>
            {this.state.poems.map( (item,index) => (
                <p style={textStyle}  key={index}>{ item.transcript }</p>
                )
            )}
            </React.Fragment>
        )

        return (
            <div style={{marginTop: '100px'}}  >
                { poemlist }
            </div>
        )
    }
}

const textStyle = {
    color: 'white',
    fontSize: 'xx-large',
}

export default Visu;
