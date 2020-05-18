import React, { Component, } from "react";
import {
  InputGroup,
  Container,
  Image,
  Button,
  Form,
} from "react-bootstrap";
import "./Login.scss";
import { FaEnvelope, FaLock, FaFacebook, FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";
import Logo from "../Logo/Logo";
import googleIcon from '../../assets/Images/google-icon.png'
import facebookIcon from '../../assets/Images/facebook-icon.png'
import Grid from "antd/lib/card/Grid";
import { Row, Col, Divider } from 'antd'
import { withRouter, } from "react-router";
import { backendUrl } from '../../global-variables';
import axios from 'axios';
import { connect } from 'react-redux'
import * as actionTypes from '../../store/actions/authActions'

class Login extends Component {

  state = { validated: false, setValidated: false }

  render() {

    let handleSubmit = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const form = event.currentTarget;
      this.setState({
        setValidated: true, validated: true
      })

      console.log(form.elements.email.value)

      axios.post(backendUrl + '/auth/login', {
        email: form.elements.email.value,
        password: form.elements.password.value
      }).then((response) => {
        console.log(response)
        if (response.data.success) {
          localStorage.setItem('token', response.data.token)
          this.props.saveToken(response.data.token);
          this.props.history.push("/home");
        }

      })


    };

    return (
      <div className="Login">
        <Grid>
          <Row>
            <Col xs={6}></Col>
            <Col xs={12}>
              <Logo></Logo>
              <Divider></Divider>
              <Form className="user-input" noValidate validated={this.state.validated} onSubmit={handleSubmit}>
                <Form.Row>
                  <Form.Group as={Col} controlId="email">
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1">
                          <FaEnvelope></FaEnvelope>
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <Form.Control
                        type="email"
                        placeholder="Email"
                        aria-describedby="inputGroupPrepend"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please choose a email.
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <Form.Group as={Col} controlId="password">
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1">
                          <FaLock></FaLock>
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        aria-describedby="inputGroupPrepend"
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a your password.
                       </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Form.Row>
                <Form.Row>
                  <div className="login-btn">
                    <Button type="submit">Login</Button>
                  </div>
                </Form.Row>

              </Form>
              <Divider />
              <div className="social-media-container">
                <div className="facebook-container">
                  <a href={backendUrl + "/auth/facebook"} className="social-media-icon">
                    <FaFacebook></FaFacebook>
                  &nbsp; Continue with Facebook
                 </a>
                </div>


                <div className="google-container">
                  <a href={backendUrl + "/auth/google"} className="social-media-icon">
                    <FaGoogle></FaGoogle>
                  &nbsp; Continue with Google
                 </a>
                </div>
                <Link to={'/register'} className="sign-up"> or Sign up here! </Link>

              </div>
            </Col>
            <Col xs={6}></Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    saveToken: (token) => { dispatch({ type: actionTypes.SAVE_TOKEN, payload: token }) }
  }
}


export default connect(null, mapDispatchToProps)(withRouter(Login));