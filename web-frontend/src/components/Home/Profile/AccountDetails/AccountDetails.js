import React, { Component } from 'react';
import { Row, Col, Divider, Button, Form, Input } from 'antd';
import './account-details.scss'
import CustomModal from '../../../../UI/Modal/Modal';
import * as globalActionTypes from '../../../../store/actions/globalActions'
import { connect } from "react-redux";
import { backendUrl } from '../../../../global-variables';
import axios from 'axios';

class AccountDetails extends Component {

    constructor(props) {
        super(props)
        this.state = {
            emailModalVisible: false,
            passwordModalVisible: false,
            emailValidated: false,
            passwordValidated: false
        }

    }

    showEmailModal = () => {
        this.setState({
            emailModalVisible: true,
        });
    }


    // handleEmailModalOk = e => {
    //     console.log(e);
    //     this.setState({
    //         emailModalVisible: false,
    //     });
    // };

    handleEmailModalCancel = e => {
        this.setState({
            emailModalVisible: false,
        });
    };

    onEmailUpdate = values => {
        console.log(values)
        this.props.toggleLoading();

    }

    showPasswordModal = () => {
        this.setState({
            passwordModalVisible: true,
        });
    }

    handlePasswordModalOk = e => {
        console.log(e);
        this.setState({
            passwordModalVisible: false,
        });
    };

    handlePasswordModalCancel = e => {
        this.setState({
            passwordModalVisible: false,
        });
    };

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
                <Row>
                    <Col span={2}></Col>
                    <Col span={4}><Button type="primary" onClick={this.showEmailModal}>Change Email</Button></Col>
                    <Col span={4}></Col>
                    <Col span={4}><Button type="primary" onClick={this.showPasswordModal}>Change Password </Button></Col>
                </Row>
                <Divider />

                <CustomModal visible={this.state.emailModalVisible}
                    handleOk={this.handleEmailModalOk}
                    handleCancel={this.handleEmailModalCancel}
                    title="Change Email"
                    formName="email-update-form"
                >
                    <Form id='email-update-form' onFinish={this.onEmailUpdate}>
                        <Form.Item
                            name="email"
                            label="E-mail"
                            rules={[
                                {
                                    type: 'email',
                                    message: 'The input is not valid E-mail!',
                                },
                                {
                                    required: true,
                                    message: 'Please input your E-mail!',
                                },
                            ]}
                            hasFeedback>
                            <Input />
                        </Form.Item>
                    </Form>
                </CustomModal>
                <CustomModal visible={this.state.passwordModalVisible}
                    handleOk={this.handlePasswordModalOk}
                    handleCancel={this.handlePasswordModalCancel}
                    title="Change Password">
                    <Form>
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[{
                                required: true,
                                message: 'Please input your password!',
                            }]}
                            hasFeedback>
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            name="confirm"
                            label="Confirm Password"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Please confirm your password!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('The two passwords that you entered do not match!');
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                    </Form>
                </CustomModal>
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        auth: state.auth,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleLoading: () => { dispatch({ type: globalActionTypes.TOGGLE_LOADING }) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountDetails);