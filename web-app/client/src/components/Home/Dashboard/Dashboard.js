import React, { Component } from 'react';
import TopPair from './TopPair/TopPair';
import { Col, Row, Divider } from 'antd';
import Balance from './Balance/Balance';
import OpenPosition from './OpenPosition/OpenPosition';
import TradeHistory from './TradeHistory/TradeHistory';
import Bot from './Bot/Bot';


class Dashboard extends Component {
    render() {
        return (
            <div>
                <Row>
                    {/* <Col span={16}> */}
                    <Col sm={24} md={24} lg={16}>
                        <Col sm={24} md={24} lg={22}>
                            <OpenPosition></OpenPosition>
                            <Divider />
                            <TradeHistory></TradeHistory>
                        </Col>
                    </Col>
                    <Col sm={24} md={24} lg={8}>
                        {/* <Col span={8}> */}
                        <Balance></Balance>
                        <Divider />
                        <TopPair></TopPair>
                        <Divider />
                        <Bot></Bot>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Dashboard;