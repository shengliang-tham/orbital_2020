import React, { Component, useState } from "react";
import {
  InputGroup,
  Container,
  Row,
  Image,
  Button,
  Col,
  Form,
} from "react-bootstrap";
import "./Register.css";
import { Link } from "react-router-dom";

function FormExample() {

    const [validated, setValidated] = useState(false);
    const [cpassword, currentPass] = useState("");
    const [confirmpassword, confPass] = useState("");
    const handleSubmit = (event) => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
      }
      if (confirmpassword != cpassword) {
        alert("Passwords do not match");
        event.preventDefault();
        event.stopPropagation();
      }

      setValidated(true);
    };
  
  

    return (
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Row>
          <Form.Group as={Col} md="6" controlId="validationCustom01">
            <Form.Label>First name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="First name"
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} md="6" controlId="validationCustom02">
            <Form.Label>Last name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Last name"
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col} md="4" controlId="validationCustom01">
            <Form.Label>Email</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder="Email Address"
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid email address.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} md="4" controlId="validationCustom02">
            <Form.Label>Trading Experience</Form.Label>
            <Form.Control as="select" value="Choose...">
                <option>Beginner</option>
                <option>Less than 5 years</option>
                <option>5 to 10 years</option>
                <option>More than 10 years</option>
            </Form.Control>
          </Form.Group>

          <Form.Group as={Col} md = "4"controlId="formGridState">
            <Form.Label>Risk Appetite</Form.Label>
            <Form.Control as="select" value="Choose...">
                <option>Giam Siap</option>
                <option>Okay lah</option>
                <option>Lamborghini money</option>
            </Form.Control>
         </Form.Group>

        </Form.Row>
        
        <Form.Row>
          <Form.Group as={Col} md="6" controlId="validationCustom03">
            <Form.Label>Password</Form.Label>
            <Form.Control 
            type="password" 
            placeholder="password" required

            onChange={ (event) => currentPass(event.target.value)}

            />
            <Form.Control.Feedback type="invalid">
              Please provide a password.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} md="6" controlId="validationCustom03">
            <Form.Label>Confirm password</Form.Label>
            <Form.Control type="password" 
            placeholder="password" required 
            onChange = { (event) => confPass(event.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a password.
            </Form.Control.Feedback>
          </Form.Group>
          
        </Form.Row>
        <div className="submit-btn">
        <Button type="submit">Register</Button>
        </div>
      </Form>
    );
  }
  


class Register extends Component {
    render() {
        return (
    
      <Container>
            <Link className="logoLink" to={'/'}> 
            <Image src="./Images/logo.png" className="logo" />
            </Link>
            <Row className="paddingNone">
            <Image src="./Images/indomie.jpg" className="indomie" />
          </Row>  
  
   
          <FormExample></FormExample>
    </Container>
    
    );
    }
}

export default Register;