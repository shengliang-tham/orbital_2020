import * as actionTypes from '../actions/userActions'

const initialState = {
    user: null
}

const globalReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case actionTypes.FETCH_USER_DETAILS: return {
            ...state,
            user: payload
        }
        case actionTypes.UPDATE_USER_DETAILS: return {
            ...state,
            user: payload
        }
        default: return state;
    }
}

export default globalReducer;