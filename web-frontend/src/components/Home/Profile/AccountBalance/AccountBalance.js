import React, { Component } from 'react';
import { Row, Col, Divider, Button, Typography, notification } from 'antd';
import './AccountBalance.scss'
import CustomModal from '../../../../UI/Modal/Modal';
import { CardElement } from '@stripe/react-stripe-js';
import * as globalActionTypes from '../../../../store/actions/globalActions'
import * as userActionTypes from '../../../../store/actions/userActions'
import { connect } from "react-redux";
import { backendUrl } from '../../../../global-variables';
import axios from 'axios';

const { Title } = Typography;

class AccountBalance extends Component {

    state = {
        topUpModalVisible: false,
        disabledButtons: false,
    }

    showTopUpModal = () => {
        this.setState({
            topUpModalVisible: true,
        });
    }

    handleTopUpModalOk = () => {
        this.setState({
            topUpModalVisible: false,
        });
    }

    handleTopUpModalCancel = () => {
        this.setState({
            topUpModalVisible: false,
        });
    }

    handleSubmit = async (event) => {
        // Block native form submission.
        event.preventDefault();

        const { stripe, elements } = this.props;

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        const cardElement = elements.getElement(CardElement);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            notification.error({
                message: 'Error',
                description: error.message,
                placement: 'bottomRight'
            });
            console.log('[error]', error);
        } else {
            console.log('[PaymentMethod]', paymentMethod);
            this.setState({
                ...this.state,
                disabledButtons: true
            })

            const response = await axios.post(backendUrl + '/stripe/generate-intent', {
                email: ""
            })

            const result = await stripe.confirmCardPayment(response.data.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                }
            });

            if (result.error) {
                console.log(result.error)
                // Show error to your customer (e.g., insufficient funds)
                console.log(result.error.message);
            } else {
                // The payment has been processed!
                console.log(result)

                if (result.paymentIntent.status === 'succeeded') {

                    //result.paymentIntent.amount
                    const response = await axios.post(backendUrl + '/user/update-balance', {
                        topUpAmount: result.paymentIntent.amount
                    })

                    if (response.data.success) {
                        notification.success({
                            message: 'Success',
                            description: "You have successfully topped up!",
                            placement: 'bottomRight'
                        });

                        this.props.updateBalance(response.data.user)
                    }
                }
            }


            this.setState({
                ...this.state,
                disabledButtons: false
            })
        }
    };

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
                        <Title level={3}>SGD ${this.props.user ? this.props.user.accountBalance : null}</Title>
                    </Col>
                </Row>
                <Divider />
                <Row>
                    <Col span={2}></Col>
                    <Col span={4}><Button type="primary" onClick={this.showTopUpModal} >Top Up</Button></Col>
                    <Col span={4}></Col>
                </Row>
                <Divider />
                <CustomModal visible={this.state.topUpModalVisible}
                    handleOk={this.handleTopUpModalOk}
                    handleCancel={this.handleTopUpModalCancel}
                    title="Top Up"
                    formName="top-up-form"
                    disabledOk={this.state.disabledButtons}
                    disabledCancel={this.state.disabledButtons}
                >

                    <form id="top-up-form" onSubmit={this.handleSubmit}>
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#424770',
                                        '::placeholder': {
                                            color: '#aab7c4',
                                        },
                                    },
                                    invalid: {
                                        color: '#9e2146',
                                    },
                                },
                            }}
                        />
                    </form>
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
        updateBalance: (user) => { dispatch({ type: userActionTypes.UPDATE_USER_DETAILS, payload: user }) }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountBalance);