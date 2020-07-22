import React, { Component } from 'react';
import { Col, Row, Divider } from 'antd';
import AccountDetails from './AccountDetails/AccountDetails';
import AccountBalance from './AccountBalance/AccountBalance';

import { loadStripe } from '@stripe/stripe-js';
import { Elements, ElementsConsumer } from '@stripe/react-stripe-js';
import * as globalActionTypes from '../../../store/actions/globalActions'
import { connect } from "react-redux";
import Telegram from './Telegram/Telegram';

const stripePromise = loadStripe('pk_test_wN093ZP2n4Buel4ASaVoZPIS');

class Profile extends Component {

    render() {
        return (
            <div>
                <Row>
                    <Col sm={24} md={24} lg={14}>
                        <AccountDetails></AccountDetails>
                        <Divider />

                        <Elements stripe={stripePromise}>
                            <ElementsConsumer>
                                {({ elements, stripe }) => (
                                    <AccountBalance elements={elements} stripe={stripe} />
                                )}
                            </ElementsConsumer>
                        </Elements>
                    </Col>
                    <Col sm={24} md={24} lg={2}></Col>
                    <Col sm={24} md={24} lg={8}>
                        <Telegram></Telegram>
                    </Col>
                </Row>
                <Divider />
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleLoading: () => { dispatch({ type: globalActionTypes.TOGGLE_LOADING }) },
    }
}


export default connect(null, mapDispatchToProps)(Profile);