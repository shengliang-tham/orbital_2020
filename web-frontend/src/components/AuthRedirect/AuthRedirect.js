import React, { Component } from 'react';
import Cookies from 'js-cookie';

class AuthRedirect extends Component {

    state = {
        token: Cookies.get('jwt')
    }

    componentDidMount() {
        localStorage.setItem('token', this.state.token);
        this.props.history.push("/home");
    }

    render() {
        return (
            <div>

            </div>
        );
    }
}

export default AuthRedirect;