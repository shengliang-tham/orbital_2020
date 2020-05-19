import React, { Component } from "react";

import "bootstrap/dist/css/bootstrap.min.css";

import { BrowserRouter as Router, Switch, Route, Redirect, } from "react-router-dom";

import { Spin, Space } from 'antd';

import AuthRedirect from "./components/AuthRedirect/AuthRedirect";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";


export class App extends Component {

  render() {
    let routes = (
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/auth-redirect" component={AuthRedirect} />
        <Redirect to={{ pathname: '/', state: { message: "Please login first!" } }} />
      </Switch>
    )

    if (this.props.auth.token) {
      routes = (
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/auth-redirect" component={AuthRedirect} />
          <Route path="/home" component={Home} />
        </Switch>
      )
    }

    return (
      <Spin size="large" tip="Loading..." spinning={this.props.global.loading}> {routes}</Spin>

    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    global: state.global
  }
}

export default connect(mapStateToProps)(App);
