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
import {Jumbo} from "./components/Jumbo";
import {Upload} from "./components/Upload";
import {AddButton} from "./components/AddButton";


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
        <Jumbo></Jumbo>
        <ToggleButton></ToggleButton>
        <Switch>
          <Route path="/penis">
            <Penis />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
        <AddButton></AddButton>
      </div>
    </Router>
  );
}

export default App;
