import React, { Component } from 'react';
import { Col, Row, Divider } from 'antd';
import AccountDetails from './AccountDetails/AccountDetails';


class Profile extends Component {
    render() {
        return (
            <div>
                <Row>
                    <Col span={12}>
                        <AccountDetails></AccountDetails>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Profile;