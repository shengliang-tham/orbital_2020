import React, { Component, useState } from "react";
import {
  InputGroup,
  FormControl,
  Container,
  Row,
  Image,
  Button,
  Col,
  Form,
} from "react-bootstrap";
import "./Login.css";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";


function FormExample() {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  return (
    <Form className="user-input" noValidate validated={validated} onSubmit={handleSubmit}>
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
      <Button type="submit">Submit form</Button>
      </div>
    </Form>
  );
}



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

        <FormExample />
        
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