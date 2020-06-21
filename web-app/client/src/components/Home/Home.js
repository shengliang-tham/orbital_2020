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

    async componentDidMount() {
        // this.props.toggleLoading();
        // axios.get(backendUrl + '/user/retrieve-user')
        //     .then(user => {
        //         user = user.data.user;
        //         console.log(user)
        //         if (!user.facebookId && !user.googleId) {
        //             this.props.setAuthType(authActionTypes.SET_AUTH_EMAIL)
        //         }
        //         this.props.fetchUserDetails(user)
        //         this.props.toggleLoading();
        //     })
        //     .catch(error => {
        //         notification.error({
        //             message: 'Error',
        //             description: error,
        //             placement: 'bottomRight'
        //         });
        //     })

        try {
            this.props.toggleLoading();
            let user = await axios.get(backendUrl + '/user/retrieve-user')
            user = user.data.user;

            console.log(user)
            user = await this.fetchTradeHistory(user)

            if (!user.facebookId && !user.googleId) {
                this.props.setAuthType(authActionTypes.SET_AUTH_EMAIL)
            }
            console.log(user)
            this.props.fetchUserDetails(user)
            this.props.toggleLoading();
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error,
                placement: 'bottomRight'
            });
        }

    }

    fetchTradeHistory = async (user) => {
        let tickers = user.transactionHistory.map(item => [item.ticker])
        let params = [].concat.apply([], tickers).join()
        console.log(params)
        const response = await axios.get(tradingUrl + '/getPortfolio', {
            params: {
                tickers: params
            }
        })
        Object.keys(response.data).forEach(ticker => {
            user.transactionHistory.map(item => {
                console.log(response.data[ticker])
                console.log(ticker)
                if (item.ticker == ticker) {
                    //If current price is lower than what user bought, its negative
                    if (parseFloat(response.data[ticker].currentPrice) < item.price) {
                        item.gain = '-' + ((item.price - parseFloat(response.data[ticker].currentPrice)) / item.price)
                    } else {
                        //Positive Gain
                        item.gain = (parseFloat(response.data[ticker].currentPrice) / item.price) * 100;
                    }
                }
            })
        })
        // console.log(user)
        // let keys = Object.keys(user.transactionHistory).filter(ticker => obj[k] === value);
        // console.log(response)
        return user;

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
        user: state.user,
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