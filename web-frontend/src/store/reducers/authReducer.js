import * as actionTypes from '../actions/authActions'



const initialState = {
    token: localStorage.getItem('token') ? localStorage.getItem('token') : null
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

    }
    return state;

}

export default authReducer;