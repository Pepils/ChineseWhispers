import React from 'react';
import { Layer, Grid } from 'react-mapping';

const poem_id = 1

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
        fetch("http://127.0.0.1:5000/recordings?poem_id="+poem_id)
            .then(result => result.json())
            .then(result => this.setState({ poems: result }))
        this.timer = setTimeout(this.getPoems, 2000)
    }

            /*  </React.Fragment> */
    render() {
        let poemlist = (
            <div style={{ width:'500px', height:'1000px'  }}>
            {this.state.poems.map( (item,index) => {
                return <p style={textStyle}  key={index}>{ item.transcript }</p>
                }
            )}
            </div>
        )

        return (
            <div style={{ height:'100vh', width:'100vw' }} >
             <Grid/>
            <Layer isEditMode={true}>
                { poemlist }
            {/* <div style={{marginTop: '100px'}} > </div> */}
            </Layer>
            </div>
        )
    }
}

const textStyle = {
    color: 'white',
    fontSize: 'xx-large',
}

export default Visu;
