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

export default class Login extends Component {
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
          <Button className="login-btn">LOGIN</Button>
        </Container>
        <Container>
          <Image src="./Images/google-icon.png" className="social-media" />
          <Image src="./Images/facebook-icon.png" className="social-media" />
        </Container>
      </div>
    );
  }
}
