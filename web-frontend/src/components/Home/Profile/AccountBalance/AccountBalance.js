import React, { Component } from 'react';
import { Row, Col, Divider, Button, Typography, notification } from 'antd';
import './AccountBalance.scss'
import CustomModal from '../../../../UI/Modal/Modal';
import { CardElement } from '@stripe/react-stripe-js';

const { Title } = Typography;

class AccountBalance extends Component {

    state = {
        topUpModalVisible: false,
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
                        <Title level={3}>$1000</Title>
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

                    {/* <Elements stripe={stripePromise}>
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
                    </Elements> */}
                </CustomModal>
            </div>
        );
    }
}

export default AccountBalance;