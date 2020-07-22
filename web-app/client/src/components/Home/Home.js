import React, { Component } from 'react';

import axios from 'axios';
import { connect } from 'react-redux';

import { backendUrl, tradingUrl } from '../../global-variables';
import * as authActionTypes from '../../store/actions/authActions';
import * as globalActionTypes from '../../store/actions/globalActions';
import * as userActionTypes from '../../store/actions/userActions';
import SideMenu from './SideMenu/SideMenu';
import { notification } from 'antd';

class Home extends Component {

    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.user && this.props.user) {
            if (prevProps.user.openPosition.length !== this.props.user.openPosition.length || prevProps.user.autoTrading !== this.props.user.autoTrading) {
                this.props.toggleLoading();

                try {
                    let user = await axios.get(backendUrl + '/user/retrieve-user')
                    user = user.data.user;

                    user = await this.fetchOpenPositions(user)
                    this.props.fetchUserDetails(user)

                } catch (error) {
                    notification.error({
                        message: 'Error',
                        description: JSON.stringify(error).message,
                        placement: 'bottomRight'
                    });
                }

                this.props.toggleLoading();
            }
        }
    }

    async componentDidMount() {
        try {
            this.props.toggleLoading();
            let user = await axios.get(backendUrl + '/user/retrieve-user')
            user = user.data.user;
            user = await this.fetchOpenPositions(user)

            if (!user.facebookId && !user.googleId) {
                this.props.setAuthType(authActionTypes.SET_AUTH_EMAIL)
            }
            this.props.fetchUserDetails(user)
            this.props.toggleLoading();

        } catch (error) {

            notification.error({
                message: 'Error',
                description: JSON.stringify(error).message,
                placement: 'bottomRight'
            });
        }

    }


    fetchOpenPositions = async (user) => {
        let tickers = user.openPosition.map(item => [item.ticker])
        let params = [].concat.apply([], tickers).join()

        try {
            const response = await axios.get(tradingUrl + '/getPortfolio', {
                params: {
                    tickers: params
                }
            })

            Object.keys(response.data).forEach(ticker => {
                user.openPosition.map(item => {
                    if (item.ticker === ticker) {
                        //If current price is lower than what user bought, its negative
                        if (parseFloat(response.data[ticker].currentPrice) < item.openPrice) {
                            item.gain = '-' + ((item.openPrice - parseFloat(response.data[ticker].currentPrice)) / item.openPrice).toFixed(2);
                        } else {
                            //Positive Gain
                            item.gain = (((parseFloat(response.data[ticker].currentPrice) / item.openPrice) - 1) * 100).toFixed(2);
                        }
                        item.currentPrice = parseFloat(response.data[ticker].currentPrice)
                    }
                    return item
                })
            })

            return user;
        } catch (error) {
            notification.error({
                message: 'Error',
                description: JSON.stringify(error).message,
                placement: 'bottomRight'
            });
        }

    }

    fetchTradeHistory = async (user) => {
        let tickers = user.transactionHistory.map(item => [item.ticker])
        let params = [].concat.apply([], tickers).join()

        try {
            const response = await axios.get(tradingUrl + '/getPortfolio', {
                params: {
                    tickers: params
                }
            })
            Object.keys(response.data).forEach(ticker => {
                user.transactionHistory.map(item => {
                    console.log(response.data[ticker])
                    console.log(ticker)
                    if (item.ticker === ticker) {
                        //If current price is lower than what user bought, its negative
                        if (parseFloat(response.data[ticker].currentPrice) < item.price) {
                            item.gain = '-' + ((item.price - parseFloat(response.data[ticker].currentPrice)) / item.price)
                        } else {
                            //Positive Gain
                            item.gain = ((parseFloat(response.data[ticker].currentPrice) / item.openPrice) - 1) * 100;
                        }
                        item.currentPrice = parseFloat(response.data[ticker].currentPrice)
                    }
                    return item
                })
            })
            return user;
        } catch (error) {
            notification.error({
                message: 'Error',
                description: JSON.stringify(error).message,
                placement: 'bottomRight'
            });
        }
    }

    render() {
        return (
            <div>
                <SideMenu></SideMenu>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setAuthType: (authType) => { dispatch({ type: authType }) },
        toggleLoading: () => { dispatch({ type: globalActionTypes.TOGGLE_LOADING }) },
        fetchUserDetails: (user) => { dispatch({ type: userActionTypes.FETCH_USER_DETAILS, payload: user }) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);