import React, { Component, useState } from "react";
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
import { Row, Col, Divider } from 'antd';

class Login extends Component {

  state = { validated: false, setValidated: false }

  render() {

    let handleSubmit = (event) => {
      const form = event.currentTarget;
      console.log(form)
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }

      this.setState({
        setValidated: true, validated: true
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
                  <Form.Group as={Col} controlId="validationCustomUsername">
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
                  <Form.Group as={Col} controlId="validationCustomUsername">
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
                {/* <Image src={googleIcon} className="social-media-icon" /> */}
                <div className="facebook-container">
                  <a href="http://localhost:5000/auth/facebook" className="social-media-icon">
                    <FaFacebook></FaFacebook>
                  &nbsp; Continue with Facebook
                 </a>
                </div>


                {/* <Image src={facebookIcon} className="social-media-icon" /> */}
                {/* <Link to={'/register'} className="sign-up"> or Sign up here! </Link> */}
                <div className="google-container">
                  <a href="http://localhost:5000/auth/google" className="social-media-icon">
                    <FaGoogle></FaGoogle>
                  &nbsp; Continue with Google
                 </a>
                </div>
              </div>


            </Col>
            <Col xs={6}></Col>

          </Row>
          <Row>

          </Row>
        </Grid>

        <Container>

        </Container>
      </div>
    );
  }
}

export default Login;