import React, { Component } from 'react';
import TopPair from './TopPair/TopPair';
import { Col, Row, Divider } from 'antd';
import Balance from './Balance/Balance';
import OpenPosition from './OpenPosition/OpenPosition';
import TradeHistory from './TradeHistory/TradeHistory';


class Dashboard extends Component {
    render() {
        return (
            <div>
                <Row>
                    <Col span={16}>
                        <Col span={22}>
                            <OpenPosition></OpenPosition>
                            <Divider />
                            <TradeHistory></TradeHistory>
                        </Col>
                    </Col>
                    <Col span={8}>
                        <Balance></Balance>
                        <Divider />
                        <TopPair></TopPair>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Dashboard;