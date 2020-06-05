import './account-details.scss';

import React, { Component } from 'react';

import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  message,
  notification,
  Row,
} from 'antd';
import axios from 'axios';
import Moment from 'react-moment';
import { connect } from 'react-redux';

import { backendUrl } from '../../../../global-variables';
import * as authActionTypes from '../../../../store/actions/authActions';
import * as globalActionTypes from '../../../../store/actions/globalActions';
import * as userActionTypes from '../../../../store/actions/userActions';
import CustomModal from '../../../../UI/Modal/Modal';

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

    componentDidMount() {
        console.log(this.props.user)
    }

    showEmailModal = () => {
        this.setState({
            emailModalVisible: true,
        });
    }

    handleEmailModalCancel = e => {
        this.setState({
            emailModalVisible: false,
        });
    };

    onEmailUpdate = values => {
        const msgIndicator = message.loading('Updating Email...', 0);

        axios.post(backendUrl + '/user/update-email', {
            email: values.email
        }).then((response) => {
            console.log(response)
            if (response.data.success) {
                console.log(response.data.user)
                this.props.updateEmail(response.data.user)
                notification.success({
                    message: 'Success',
                    description: "You have successfully changed your email",
                    placement: 'bottomRight'
                });
            } else {
                notification.error({
                    message: 'Error',
                    description: response.data.message,
                    placement: 'bottomRight'
                });
            }
            this.setState({
                emailModalVisible: false,
            });
            msgIndicator();
        }).catch(error => {
            notification.error({
                message: 'Error',
                description: error,
                placement: 'bottomRight'
            });
            msgIndicator();
        })

    }

    showPasswordModal = () => {
        this.setState({
            passwordModalVisible: true,
        });
    }

    handlePasswordModalCancel = e => {
        this.setState({
            passwordModalVisible: false,
        });
    };

    onPasswordUpdate = (value) => {
        console.log(value)
        const msgIndicator = message.loading('Updating Email...', 0);

        axios.post(backendUrl + '/user/update-password', {
            password: value.password
        }).then((response) => {
            console.log(response)
            if (response.data.success) {
                console.log(response.data.user)
                notification.success({
                    message: 'Success',
                    description: "You have successfully changed your password",
                    placement: 'bottomRight'
                });
            } else {
                notification.error({
                    message: 'Error',
                    description: response.data.message,
                    placement: 'bottomRight'
                });
            }
            this.setState({
                passwordModalVisible: false,
            });
            msgIndicator();
        }).catch(error => {
            notification.error({
                message: 'Error',
                description: error,
                placement: 'bottomRight'
            });
            msgIndicator();
        })
    }

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
                            Email Address : {this.props.user ? this.props.user.email : ""}
                        </Row>
                        <Row>
                            Registration Date : <div>
                                <Moment date={this.props.user ? this.props.user.created : null} />
                            </div>
                        </Row>
                    </Col>
                </Row>
                <Divider />
                <Row>
                    <Col span={2}></Col>
                    <Col span={4}><Button type="primary" onClick={this.showEmailModal}>Change Email</Button></Col>
                    <Col span={4}></Col>
                    {this.props.auth.authType === authActionTypes.SET_AUTH_EMAIL ?
                        <Col span={4}><Button type="primary" onClick={this.showPasswordModal}>Change Password </Button></Col>
                        : null
                    }

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
                    title="Change Password"
                    formName="password-update-form">
                    <Form id='password-update-form' onFinish={this.onPasswordUpdate}>
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
        user: state.user.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleLoading: () => { dispatch({ type: globalActionTypes.TOGGLE_LOADING }) },
        updateEmail: (user) => { dispatch({ type: userActionTypes.UPDATE_USER_DETAILS, payload: user }) }
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(AccountDetails);