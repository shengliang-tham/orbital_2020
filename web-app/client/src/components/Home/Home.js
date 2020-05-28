import React, { Component } from 'react';
import SideMenu from './SideMenu/SideMenu';
import axios from 'axios';
import { backendUrl } from '../../global-variables'
import { connect } from "react-redux";
import * as globalActionTypes from '../../store/actions/globalActions'
import * as userActionTypes from '../../store/actions/userActions'
class Home extends Component {

    componentDidMount() {
        this.props.toggleLoading();
        axios.get(backendUrl + '/user/retrieve-user').then(user => {
            console.log(user)
            this.props.fetchUserDetails(user.data.user)
            this.props.toggleLoading();
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
        toggleLoading: () => { dispatch({ type: globalActionTypes.TOGGLE_LOADING }) },
        fetchUserDetails: (user) => { dispatch({ type: userActionTypes.FETCH_USER_DETAILS, payload: user }) },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);