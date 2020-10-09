import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Home } from './pages/Home';
import { Penis } from './pages/Penis';
import { ToggleButton } from "./components/ToggleButton";


function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/penis">Penis</Link>
            </li>
          </ul>
        </nav>
        <ToggleButton></ToggleButton>
        <Switch>
          <Route path="/penis">
            <Penis />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
