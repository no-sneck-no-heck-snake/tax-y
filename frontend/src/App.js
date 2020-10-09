import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Home } from "./pages/Home";
import { Penis } from "./pages/Penis";
import { ImportFile } from "./components/ImportFile";
import { ThemeProvider } from "@material-ui/core";
import styled, { createGlobalStyle } from "styled-components";
import { theme } from "./Theme";
import { Navigation } from "./components/Navigation";

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
  }
  body {
    background: #F6F9FC;
  }
`;

const Content = styled.section`
  padding: 32px;
  display: flex;
  flex-direction: column;
  margin: auto;
  max-width: 900px;
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Router>
          <div>
            <Navigation></Navigation>
            <Content>
              <Switch>
                <Route path="/penis">
                  <Penis />
                </Route>
                <Route path="/">
                  <Home />
                </Route>
              </Switch>
            <ImportFile></ImportFile>
            </Content>
          </div>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
