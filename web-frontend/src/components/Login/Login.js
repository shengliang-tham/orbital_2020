import React, { Component, useState } from "react";
import {
  InputGroup,
  Container,
  Image,
  Button,
  Col,
  Form,
} from "react-bootstrap";
import "./Login.scss";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import Logo from "../Logo/Logo";

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
        <Logo></Logo>

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
                  placeholder="password"
                  aria-describedby="inputGroupPrepend"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please enter a your password.
            </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
          </Form.Row>
          <div className="login-btn">
            <Button type="submit">Login</Button>
          </div>
        </Form>

        <Container>
          <div className="social-media">
            <Image src="./Images/google-icon.png" className="social-media-icon" />
            <Image src="./Images/facebook-icon.png" className="social-media-icon" />
            <Link to={'/register'} className="sign-up"> or Sign up here! </Link>
          </div>
        </Container>
      </div>
    );
  }
}

export default Login;