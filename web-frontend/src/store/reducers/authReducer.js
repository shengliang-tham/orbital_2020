import * as actionTypes from '../actions/authActions'
const initialState = {
    token: null
}
const authReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case actionTypes.SAVE_TOKEN: return {
            ...state,
            token: payload
        }
    }
    return state;

}

export default authReducer;