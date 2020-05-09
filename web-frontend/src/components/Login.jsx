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
        <Button>Login</Button>
      </div >
    );
  }
}
