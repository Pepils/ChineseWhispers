import React from 'react';
import './App.css';

import {
  BrowserRouter,
  Switch,
  Route
} from "react-router-dom";
import SoundPlayer from './views/SoundPlayer'
import Selector from './views/Selector'

class App extends React.Component {

  render() {
      return (
        <div className="App">
            <BrowserRouter>
                <Switch>
                    <Route path="/player" render={ (props) => <SoundPlayer {...props} />} />
                    <Route path={[ "/","/selector"]} component={Selector} />
                </Switch>
              </BrowserRouter>
        </div>
    );
  }
}

export default App;
