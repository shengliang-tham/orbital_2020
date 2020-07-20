import React, { Component } from 'react';
import { Switch, Row, Col } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import './Bot.scss';
import { connect } from 'react-redux';
import * as globalActionTypes from '../../../../store/actions/globalActions';
import * as userActionTypes from '../../../../store/actions/userActions'
import axios from 'axios';
import { backendUrl } from './../../../../global-variables';

class Bot extends Component {

    onChange = async (checked) => {
        this.props.toggleLoading();
        console.log(`switch to ${checked}`);
        const response = await axios.post(backendUrl + '/user/update-autotrade', {
            autoTrade: checked
        });
        this.props.updateUser(response.data.user);
        this.props.toggleLoading();
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
                            Auto Trading Bot is {this.props.user ? this.props.user.autoTrading ? "enabled" : "disabled" : "disabled"}
                        </div>
                        <div className="toggle-button">
                            <Switch checked={this.props.user ? this.props.user.autoTrading : false} onChange={this.onChange} />
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user
    }
}


const mapDispatchToProps = dispatch => {
    return {
        toggleLoading: () => { dispatch({ type: globalActionTypes.TOGGLE_LOADING }) },
        updateUser: (user) => { dispatch({ type: userActionTypes.UPDATE_USER_DETAILS, payload: user }) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Bot);