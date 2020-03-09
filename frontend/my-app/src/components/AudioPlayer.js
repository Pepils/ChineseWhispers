import React from 'react';

import './AudioPlayer.css';

class AudioPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playing: false,
            player: null,
            src: props.source
        };

        this.play = this.play.bind(this);
        this.stop = this.stop.bind(this);
    }

    componentDidMount() {
        this.setState({
            player: document.getElementById("player")
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            src: nextProps.source
        })
    }

    play() {
        const { player } = this.state;

        player.play();

        this.setState({
            playing: true,
        });
    }

    stop() {
        const { player } = this.state;
        const { onPlayed } = this.props;

        player.pause();
        player.currentTime = 0;

        this.setState({
            playing: false
        });

        if (onPlayed)
            onPlayed();
    }

    controlAudio = () => {
        const { playing, src } = this.state;

        if(src !== null)
            playing ? this.stop() : this.play();
    }

    render() {

        const { playing, src } = this.state;

        const buttonClass = () => {
            if (src !== null) {
                return playing ? "audio-control red" : "audio-control green"
            }
            else {
                return "audio-control gray"
            }
        }

        return (
            <div className="AudioPlayer">
                <audio
                    id="player"
                    ref="audioSource"
                    src={src}
                    lol="http://127.0.0.1:5000/files/myrecord.webm"
                    onEnded={() => this.stop()}
                />

                <div className={buttonClass()} onClick={() => this.controlAudio()}>
                    {playing ? "Stop" : "Listen"}
                </div>
            </div>
        );
    }
}

export default AudioPlayer;