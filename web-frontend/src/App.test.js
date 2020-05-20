import React from 'react'
import { mount } from 'enzyme'
import { Provider } from "react-redux";

import configureMockStore from "redux-mock-store";

import { MemoryRouter } from 'react-router-dom';

import App from './App';

import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import './mocks/matchMedia'

const unAuthenticatedMockStore = configureMockStore();
let unAuthenticatedInitialState = {
    auth: {
        token: null
    },
    global: {
        loading: false
    }
}
let unAuthenticatedStore = unAuthenticatedMockStore(unAuthenticatedInitialState);

const authenticatedMockStore = configureMockStore();
let authenticatedInitialState = {
    auth: {
        token: 'asdas2asdasd'
    },
    global: {
        loading: false
    }
}
let authenticatedStore = authenticatedMockStore(authenticatedInitialState);



describe('App Component', () => {

    it('should not display home page if user havent logged in', () => {
        const wrapper = mount(
            <Provider store={unAuthenticatedStore}>
                <MemoryRouter initialEntries={['/home']}>
                    <App />
                </MemoryRouter>
            </Provider>);
        expect(wrapper.find(Home)).toHaveLength(0);
        wrapper.unmount();
    })

    it('should display login page if user havent logged in', () => {
        const wrapper = mount(
            <Provider store={unAuthenticatedStore}>
                <MemoryRouter initialEntries={['/']}>
                    <App />
                </MemoryRouter>
            </Provider>);
        expect(wrapper.find(Login)).toHaveLength(1);
        wrapper.unmount();
    })

    it('should display register page if user havent logged in', () => {
        const wrapper = mount(
            <Provider store={unAuthenticatedStore}>
                <MemoryRouter initialEntries={['/register']}>
                    <App />
                </MemoryRouter>
            </Provider>);
        expect(wrapper.find(Register)).toHaveLength(1);
        wrapper.unmount();
    })


    it('should display home page if user logged in', () => {
        const wrapper = mount(
            <Provider store={authenticatedStore}>
                <MemoryRouter initialEntries={['/home']}>
                    <App />
                </MemoryRouter>
            </Provider>);
        expect(wrapper.find(Home)).toHaveLength(1);
        wrapper.unmount();
    })

})