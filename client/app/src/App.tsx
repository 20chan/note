import * as React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import LoginPage from "./login";
import { NotePage } from "./notes";

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/"><NotePage /></Route>
                <Route path="/login"><LoginPage /></Route>
            </Switch>
        </Router>
    );
}

export default App;
