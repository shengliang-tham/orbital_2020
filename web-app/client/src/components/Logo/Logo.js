import React, { Component } from 'react';
import './Logo.scss';
import logo from '../../assets/Images/logo.png'
import indomieLogo from '../../assets/Images/Indomie.jpg'
import Grid from "antd/lib/card/Grid";
import { Row, } from 'antd';
import { Image, } from "react-bootstrap";

class Logo extends Component {
    render() {
        return (
            <div className="Logo">
                <Grid>
                    <Row>
                        <Image src={logo} className="logo" />
                    </Row>
                    <Row>
                        <Image src={indomieLogo} className="indomie" />
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default Logo;