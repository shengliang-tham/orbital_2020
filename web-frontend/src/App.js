import React, { Component } from "react";
import Login from "./components/Login/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Register from "./components/Register/Register"
// import "antd/dist/antd.css"

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/home" component={Home} />
          <Route path="/register" component={Register} />
        </Switch>
      </Router>
    );
  }
}

export default App;
