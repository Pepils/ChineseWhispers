import React from 'react';
import './App.css';

import {
    BrowserRouter,
    Redirect,
    Switch,
    Route,
} from "react-router-dom";

import Home from './views/Home';
import Selector from './views/Selector';
import Player from './views/Player';
import Recorder from './views/Recorder';
import Finnish from './views/Finnish';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect : false
        }
    }

    componentDidMount() {
        document.addEventListener('mousemove', this.resetTimer);
        document.addEventListener('mousedown', this.resetTimer);
        document.addEventListener('keypress', this.resetTimer);
        document.addEventListener('touchmove', this.resetTimer);

        this.startTimer();
    }

    componentWillUnmount() {
        document.removeEventListener('mousemove', this.resetTimer);
        document.removeEventListener('mousedown', this.resetTimer);
        document.removeEventListener('keypress', this.resetTimer);
        document.removeEventListener('touchmove', this.resetTimer);
    }

    startTimer = () => {
        if (this.timerActivity) clearTimeout(this.timerActivity);

        this.timerActivity = setTimeout((): void => this.redirect(), 30 * 1000);
        if (this.state.redirect)
            this.setState({redirect: false})
    };

    resetTimer = () => {
        console.log('reset');
        clearTimeout(this.timerActivity);
        this.timerActivity = null;
        this.startTimer();
    };

    redirect = () => {
        console.log("ScreenSaver!")
        this.setState({redirect: true})
    }

    render() {
        return (
            <div className="App">
                <BrowserRouter>
                    {this.state.redirect && <Redirect to="/" />}
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/selector" component={Selector} />
                        <Route path="/player" render={(props) => <Player {...props} />} />
                        <Route path="/recorder" render={(props) => <Recorder {...props} />} />
                        <Route path="/finnish" component={Finnish} />
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
