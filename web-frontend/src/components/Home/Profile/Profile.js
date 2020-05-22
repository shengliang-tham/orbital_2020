import React, { Component } from 'react';
import { Col, Row, Divider } from 'antd';
import AccountDetails from './AccountDetails/AccountDetails';
import AccountBalance from './AccountBalance/AccountBalance';

import { loadStripe } from '@stripe/stripe-js';
import { Elements, ElementsConsumer } from '@stripe/react-stripe-js';
import axios from 'axios';
import { backendUrl } from '../../../global-variables'
import * as globalActionTypes from '../../../store/actions/globalActions'
import { connect } from "react-redux";

const stripePromise = loadStripe('pk_test_wN093ZP2n4Buel4ASaVoZPIS');

class Profile extends Component {

    render() {
        return (
            <div>
                <Row>
                    <Col span={12}>
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
                </Row>
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