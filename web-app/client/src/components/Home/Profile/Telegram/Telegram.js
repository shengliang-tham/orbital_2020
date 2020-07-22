import React, { Component } from 'react';
import { Divider, Row, Button } from 'antd';
import './telegram.scss';
import { Col } from 'antd';
import axios from 'axios';
import { backendUrl } from './../../../../global-variables';

class Telegram extends Component {

    onActivateTelegram = async () => {
        const response = await axios.get(backendUrl + '/user/telegram-activate');
        window.open(response.data, "_blank")
    }

    render() {
        return (
            <div className="telegram">
                <Row align="middle" justify="center">
                    <div className="header">
                        Telegram Notification
                     </div>
                </Row>
                <Divider />
                <Row>
                    <Col span={2}></Col>
                    You can use Telegram bot to receive trading notification from Indomie.
                </Row>
                <Divider />
                <Row>
                    <Col span={2}></Col>
                    <Col span={4}><Button type="primary" onClick={this.onActivateTelegram}>Activate Notification</Button></Col>
                    <Col span={4}></Col>
                </Row>
                <Divider />

            </div>
        );
    }
}

export default Telegram;