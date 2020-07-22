import React, { Component } from 'react';
import './Logo.scss';
import indomieLogo from '../../assets/Images/indomie-logo.png'
import Grid from "antd/lib/card/Grid";
import { Row, } from 'antd';
import { Image, } from "react-bootstrap";

class Logo extends Component {
    render() {
        return (
            <div className="Logo">
                <Grid>
                    <Row>
                        <Image src={indomieLogo} className="logo" />
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default Logo;