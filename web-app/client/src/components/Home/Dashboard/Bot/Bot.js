import React, { Component } from 'react';
import { Switch, Row, Col } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import './Bot.scss';

class Bot extends Component {

    onChange = (checked) => {
        console.log(`switch to ${checked}`);
    }

    render() {
        return (
            <div className="Bot">
                <Row className="row">
                    <Col span={6}>
                        <div className="robot">
                            <RobotOutlined className="robot-icon" />

                        </div>
                    </Col>
                    <Col span={18} >
                        <div className="toggle-text">
                            Auto Trading Bot is enabled
                        </div>
                        <div className="toggle-button">
                            <Switch defaultChecked onChange={this.onChange} />
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Bot;