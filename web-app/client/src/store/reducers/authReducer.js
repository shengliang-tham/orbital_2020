import * as actionTypes from '../actions/authActions'



const initialState = {
    token: localStorage.getItem('token') ? localStorage.getItem('token') : null,
    authType: null
}
const authReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case actionTypes.SAVE_TOKEN: return {
            ...state,
            token: payload
        }
        case actionTypes.DELETE_TOKEN: return {
            ...state,
            token: null
        }
        case actionTypes.SET_AUTH_EMAIL: return {
            ...state,
            authType: actionTypes.SET_AUTH_EMAIL
        }
        case actionTypes.SET_AUTH_FACEBOOK: return {
            ...state,
            authType: actionTypes.SET_AUTH_FACEBOOK
        }
        case actionTypes.SET_AUTH_GOOGLE: return {
            ...state,
            authType: actionTypes.SET_AUTH_GOOGLE
        }

    }
    return state;

}

export default authReducer;