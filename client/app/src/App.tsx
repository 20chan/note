import * as React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { LoginForm } from "./login";
import { NotePage } from "./notes";

function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/"><LoginForm /></Route>
                <Route path="/notes"><NotePage /></Route>
            </Switch>
        </Router>
    );
}

export default App;
  