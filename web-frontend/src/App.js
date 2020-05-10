import React, { Component } from "react";
import Login from "./components/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" component={Login} />
        </Switch>
      </Router>
    );
  }
}

export default App;
