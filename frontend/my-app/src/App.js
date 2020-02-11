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
      <div>
        <Switch>
          <Route exact path="/">
            <SoundPlayer> </SoundPlayer>
          </Route>
          <Route path="/selector">
         <Selector />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
    );
  }
}

export default App;
