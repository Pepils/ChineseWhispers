import React from 'react';
import * as WHS from 'whs';
import * as THREE from 'three';
import TextTexture from '@seregpie/three.text-texture';
import html2canvas from 'html2canvas';

import './App.css'


const world = new WHS.App([
    new WHS.ElementModule(),
    new WHS.SceneModule(),
    new WHS.CameraModule({
        position: new THREE.Vector3(0, 0, 50),
        rotation: new THREE.Vector3(-Math.PI / 8, 0, 0),
    }),
    new WHS.RenderingModule({ bgColor: 0x162129 }),
    new WHS.ResizeModule()
]);



const cylinder = new WHS.Cylinder({
    geometry: {
        radiusTop: 20,
        radiusBottom: 30,
        height: 32,
        radiusSegments: 64, // Number
        heightSegments: 1, // Number
        openEnded: true, // Boolean
        thetaStart: 1.75 * Math.PI, // Number
        thetaLength: 0.5 * Math.PI // Number
    },

    material: new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        map: null
    }),

    position: [0, -10, 5]
});

cylinder.addTo(world);

class Visu extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            poems: [],
        }

        world.start(); // Run app.
    }

    componentDidMount() {
        this.timer = setTimeout(this.getPoems, 5000);
        this.updateTextures();
    }
    
    componentWillUnmount() {
        clearTimeout(this.timer);
        this.timer = null;
    }

    componentDidUpdate(prevProps, prevState) {
        this.updateTextures();
    }

    getPoems = () => {
        fetch("http://127.0.0.1:5000/recordings?")
            .then(result => result.json())
            .then(result => {
                let poems = [];
                console.log("Results: ", result);
                for (var i = 0; i < result.length; i++) {
                    let record = result[i];
                    let index = poems.indexOf(poems.find(x => x.id === record.poem_id));
                    console.log("Item ", i, " index ", index);
                    if (index !== -1) {
                        poems[index].transcripts.push(record.transcript);
                    } else {
                        poems.push({
                            id: record.poem_id,
                            transcripts: [record.transcript]
                        });
                    }
                    console.log(poems)
                }
                this.setState({
                    poems: poems
                })
                console.log(poems)
            });
        this.timer = setTimeout(this.getPoems, 2000)
    }

    updateTextures = () => {
        let container = document.querySelector(".Visu");
        console.log(container);
        html2canvas(container).then(function (canvas) {
            console.log(canvas)
            //document.querySelector(".Visu").appendChild(canvas);
            let texture = new THREE.Texture(canvas);
            texture.needsUpdate = true;
            cylinder.material.map = texture;
            cylinder.material.needsUpdate = true;
        });
    }

    render() {
        const { poems } = this.state
        const poemRender = poems.map((poem, i) => {
            const parags = poem.transcripts.map((transcript, j) => {
                const lines = transcript.split(';').map((line, k) => {
                    return (
                        <p className="poem-line" key={k}>{line}</p>
                    );
                })
                
                return (
                    <div className="poem-parag" key={j}>{lines}</div>
                );
            })

            return (
                <div className="poem-container" key={i}>
                    {parags}
                    <p> </p>
                </div>
            );
        })
        return (
            <div className="Visu">
                {poemRender}
            </div>
        )
    }
}

export default Visu;
