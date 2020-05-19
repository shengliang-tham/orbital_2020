import React, { Component } from "react";
import Login from "./components/Login/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route, Redirect, BrowserRouter } from "react-router-dom";
import Home from "./components/Home/Home";
import Register from "./components/Register/Register"
import AuthRedirect from "./components/AuthRedirect/AuthRedirect";
import { connect } from 'react-redux'
import { Spin, Space } from 'antd';
// import "antd/dist/antd.css"

class App extends Component {

  render() {
    console.log(this.props.auth.token)
    console.log(this.props.global.loading)

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
      <BrowserRouter>
        <Router>
          <Spin size="large" tip="Loading..." spinning={this.props.global.loading}> {routes}</Spin>
        </Router>
      </BrowserRouter>

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
