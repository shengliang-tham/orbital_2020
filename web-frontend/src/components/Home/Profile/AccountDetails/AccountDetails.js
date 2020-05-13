import React, { Component } from 'react';
import { Row, Col, Divider, Button } from 'antd';
import './account-details.scss'



class AccountDetails extends Component {
    render() {
        return (
            <div className="account-details">
                <Row align="middle" justify="center">
                    <div className="header">
                        Account Details
                     </div>
                </Row>
                <Divider />
                <Row >
                    <Col span={2}></Col>
                    <Col>
                        <Row>
                            First Name : Nasi
                        </Row>
                        <Row>
                            Last Name : Babi
                        </Row>
                        <Row>
                            Email Address : nasibabi@gmail.com
                        </Row>
                        <Row>
                            Registration Date : 10 May 2020
                        </Row>
                    </Col>
                </Row>
                <Divider />
                <Row >
                    <Col span={2}></Col>
                    <Col span={4}><Button type="primary" >Change Email</Button></Col>
                    <Col span={4}></Col>
                    <Col span={4}><Button type="primary">Change Password</Button></Col>
                </Row>
                <Divider />
            </div>
        );
    }
}

export default AccountDetails;