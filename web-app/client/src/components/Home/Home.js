import React, { Component } from 'react';

import axios from 'axios';
import { connect } from 'react-redux';

import { backendUrl } from '../../global-variables';
import * as authActionTypes from '../../store/actions/authActions';
import * as globalActionTypes from '../../store/actions/globalActions';
import * as userActionTypes from '../../store/actions/userActions';
import SideMenu from './SideMenu/SideMenu';
import { notification } from 'antd';

class Home extends Component {

    componentDidMount() {
        this.props.toggleLoading();
        axios.get(backendUrl + '/user/retrieve-user')
            .then(user => {
                user = user.data.user;
                console.log(user)
                if (!user.facebookId && !user.googleId) {
                    this.props.setAuthType(authActionTypes.SET_AUTH_EMAIL)
                }
                this.props.fetchUserDetails(user)
                this.props.toggleLoading();
            })
            .catch(error => {
                notification.error({
                    message: 'Error',
                    description: error,
                    placement: 'bottomRight'
                });
            })
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