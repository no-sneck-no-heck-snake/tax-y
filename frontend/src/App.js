import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Home } from "./pages/Home";
import { CreateEntry } from "./pages/CreateEntry";
import { ImportFile } from "./components/ImportFile";
import { ThemeProvider } from "@material-ui/core";
import styled, { createGlobalStyle } from "styled-components";
import { theme } from "./Theme";
import { Navigation } from "./components/Navigation";
import { Provider } from "use-http";

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
  max-width: 1200px;
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <Provider url="http://10.10.1.123:5000">
        <ThemeProvider theme={theme}>
          <Router>
            <div>
              <Navigation></Navigation>
              <Content>
                <Switch>
                  <Route path="/create-entry">
                    <CreateEntry />
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
      </Provider>
    </>
  );
}

export default App;
