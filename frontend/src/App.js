import React from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {Home} from "./pages/Home";
import {EntryDetail} from "./pages/EntryDetail";
import {ThemeProvider} from "@material-ui/core";
import styled, {createGlobalStyle} from "styled-components";
import {theme} from "./Theme";
import {Navigation} from "./components/Navigation";
import {Provider} from "use-http";
import {AccountDetail} from "./pages/AccountDetail";

const GlobalStyle = createGlobalStyle`
  html, body {
    margin: 0;
    padding: 0;
    font-family: 'Roboto', sans-serif;
    padding-bottom: 64px;
  }
  body {
    background: #F6F9FC;
  }
`;

const Content = styled.section`
  padding: 16px;
  display: flex;
  flex-direction: column;
  margin: auto;
  max-width: 1200px;
`;

function App() {
    return (
        <>
            <GlobalStyle/>
            <Provider url="http://10.10.1.123:5000" options={{cacheLife: 0, cachePolicy: "no-cache"}}>
                <ThemeProvider theme={theme}>
                    <Router>
                        <div>
                            <Navigation></Navigation>
                            <Content>
                                <Switch>
                                    <Route path="/entry/:entryId">
                                        <EntryDetail/>
                                    </Route>
                                    <Route path="/detail/deduction">
                                        <AccountDetail/>
                                    </Route>
                                    <Route path="/">
                                        <Home/>
                                    </Route>
                                </Switch>
                            </Content>
                        </div>
                    </Router>
                </ThemeProvider>
            </Provider>
        </>
    );
}

export default App;
