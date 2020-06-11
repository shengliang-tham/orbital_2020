import React from 'react';

import ReactDOM from 'react-dom';

import { BrowserRouter } from 'react-router-dom';

import { compose, combineReducers, createStore } from 'redux';

import App from './App';
import * as serviceWorker from './serviceWorker';

import globalReducer from './store/reducers/globalReducer';
import authReducer from './store/reducers/authReducer'
import userReducer from './store/reducers/userReducer'
import { Provider } from 'react-redux';
import axios from 'axios';
import { notification } from 'antd';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const allReducer = combineReducers({
  auth: authReducer
  , global: globalReducer,
  user: userReducer
})
const store = createStore(allReducer, composeEnhancers())

axios.interceptors.request.use(request => {

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('token')
  }
  request.headers = headers

  return request
})

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
