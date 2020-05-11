import React, { Component } from "react";
import {
  InputGroup,
  FormControl,
  Container,
  Row,
  Image,
  Button,
} from "react-bootstrap";
import "./Login.css";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";


class Login extends Component {

  render() {
    return (
      <div>
        <Container>
          <Row>
            <Image src="./Images/logo.png" className="logo" />
          </Row>
          <Row>
            <Image src="./Images/indomie.jpg" className="indomie" />
          </Row>
        </Container>
        <Container>
          <div className="user-input">
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">
                  <FaEnvelope></FaEnvelope>
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl placeholder="Username" />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">
                  <FaLock></FaLock>
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl placeholder="Password" type="password" />
            </InputGroup>
          </div>
          <div className="login-btn">

            <Button onClick={this.formSubmit} >LOGIN </Button>


          </div>
        </Container>
        <Container>
          <div className="social-media">
            <Image src="./Images/google-icon.png" className="social-media-icon" />
            <Image src="./Images/facebook-icon.png" className="social-media-icon" />
            <Link to={'/sign-up'} className="sign-up"> or Sign up here! </Link>
          </div>
        </Container>
      </div>
    );
  }
}

export default Login;