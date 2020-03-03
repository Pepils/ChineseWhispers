import React from 'react';
import './App.css';

import {
  BrowserRouter,
  Switch,
  Route
} from "react-router-dom";
import SoundPlayer from './SoundPlayer'
import Selector from './Selector'

class App extends React.Component {

  render() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/player" render={ (props) => <SoundPlayer {...props} />} />
                <Route path={[ "/","/selector"]} component={Selector} />
            </Switch>
        </BrowserRouter>
    );
  }
}

export default App;
