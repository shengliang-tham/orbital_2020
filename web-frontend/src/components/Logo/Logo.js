import React, { Component } from 'react';
import './Logo.scss';
import {
    Container,
    Row,
    Image,
} from "react-bootstrap";
import logo from '../../assets/Images/logo.png'
import indomieLogo from '../../assets/Images/Indomie.jpg'

class Logo extends Component {
    render() {
        return (
            <div className="Logo">
                <Container fluid="sm">
                    <Row className="paddingNone">
                        <Image src={logo} className="logo" />
                    </Row>
                    <Row className="paddingNone">
                        <Image src={indomieLogo} className="indomie" />
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Logo;