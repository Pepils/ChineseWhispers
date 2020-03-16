import React from 'react';
import * as WHS from 'whs';
import * as THREE from 'three';
import TextTexture from '@seregpie/three.text-texture';

const poem_id = 1;

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


const texture = new TextTexture({
    fillStyle: '#ffffff',
    fontFamily: '"Times New Roman", Times, serif',
    fontSize: 40,
    fontStyle: 'italic',
    text: [
        'Yolo la compagnie,',
        'Coucouuuuuu',
        'Up above the world so high,',
        'Like a diamond in the sky.',
        '',
        'Twinkle, twinkle, little star,',
        'How I wonder what you are!',
        'Up above the world so high,',
        'Like a diamond in the sky.',
        'Like a diamond in the sky.',
        '',
        'Twinkle, twinkle, little star,',
        'How I wonder what you are!',
        'Up above the world so high,',
        'Like a diamond in the sky.',
        'Like a diamond in the sky.',
    ].join('\n')
});

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
        map: texture
    }),

    position: [0, -10, 5]
});

texture.redraw();
cylinder.addTo(world);


world.start(); // Run app.

class Visu extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            poems: [],
        }
    }

    componentDidMount() {
        this.timer = setTimeout(this.getPoems, 5000);
    }
    
    componentWillUnmount() {
        clearTimeout(this.timer);
        this.timer = null;
    }

    getPoems = () => {
        fetch("http://127.0.0.1:5000/recordings?poem_id="+poem_id)
            .then(result => result.json())
            .then(result => {
                console.log(result)
            })
        this.timer = setTimeout(this.getPoems, 2000)
        

        texture.text = [
            'Twinkle, twinkle, little star,',
            'How I wonder what you are!',
            'Up above the world so high,',
            'Like a diamond in the sky.',
            '',
            'Twinkle, twinkle, little star,',
            'How I wonder what you are!',
            'Up above the world so high,',
            'Like a diamond in the sky.',
            'Like a diamond in the sky.',
            '',
            'Twinkle, twinkle, little star,',
            'How I wonder what you are!',
            'Up above the world so high,',
            'Like a diamond in the sky.',
            'Like a diamond in the sky.',
        ].join('\n')
        
        texture.redraw();
    }

    render() {
        return (
            <div className="Visu">
                Hello
            </div>
        )
    }
}

export default Visu;
