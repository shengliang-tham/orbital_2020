import React, { Component } from "react";
import Login from "./components/Login/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import "antd/dist/antd.css"

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/home" component={Home} />
        </Switch>
      </Router>
    );
  }
}

export default App;
