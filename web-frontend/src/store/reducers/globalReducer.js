import * as actionTypes from '../actions/globalActions'

const initialState = {
    loading: false
}

const globalReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case actionTypes.TOGGLE_LOADING: return {
            ...state,
            loading: !state.loading
        }
    }
    return state;

}

export default globalReducer;