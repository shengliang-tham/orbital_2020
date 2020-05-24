import React, { Component } from 'react';
import Cookies from 'js-cookie';
import { connect } from 'react-redux'
import * as actionTypes from '../../store/actions/authActions'

class AuthRedirect extends Component {


    componentDidMount() {
        const token = Cookies.get('jwt')
        localStorage.setItem('token', token);
        this.props.saveToken(token);
        this.props.history.push("/home");
    }

    render() {
        return (
            <div>

            </div>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveToken: (token) => { dispatch({ type: actionTypes.SAVE_TOKEN, payload: token }) }
    }
}

export default connect(null, mapDispatchToProps)(AuthRedirect);