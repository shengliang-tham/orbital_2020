import React, { Component } from 'react';
import { Row, Col, Divider, Button, Typography } from 'antd';
import './AccountBalance.scss'


const { Title } = Typography;

class AccountBalance extends Component {
    render() {
        return (
            <div className="account-balance">
                <Row align="middle" justify="center">
                    <div className="header">
                        Account Balance
                 </div>
                </Row>
                <Divider />
                <Row >
                    <Col span={2}></Col>
                    <Col>
                        <Title level={3}>$1000</Title>
                    </Col>
                </Row>
                <Divider />
                <Row>
                    <Col span={2}></Col>
                    <Col span={4}><Button type="primary" >Top Up</Button></Col>
                    <Col span={4}></Col>
                </Row>
                <Divider />
            </div>
        );
    }
}

export default AccountBalance;