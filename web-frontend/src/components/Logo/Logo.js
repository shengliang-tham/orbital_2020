import React, { Component } from 'react';
import './Logo.scss';
import {
    Container,
    Row,
    Image,
} from "react-bootstrap";

class Logo extends Component {
    render() {
        return (
            <div className="Logo">
                <Container fluid="sm">
                    <Row className="paddingNone">
                        <Image src="./Images/logo.png" className="logo" />
                    </Row>
                    <Row className="paddingNone">
                        <Image src="./Images/indomie.jpg" className="indomie" />
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Logo;