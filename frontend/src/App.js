import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Home } from "./pages/Home";
import { Penis } from "./pages/Penis";
import { ToggleButton } from "./components/ToggleButton";
import { ThemeProvider } from "@material-ui/core";
import { createGlobalStyle } from "styled-components";
import { theme } from "./Theme";

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
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
      </ThemeProvider>
    </>
  );
}

export default App;
