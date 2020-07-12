import '../../mocks/matchMedia';

import React from 'react';

import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';

import * as global from '../../global-variables';
import * as globalActionTypes from '../../store/actions/globalActions';
import Login from './Login';
import { console } from '../../mocks/matchMedia';

let axios = require("axios");
let MockAdapter = require("axios-mock-adapter");

// This sets the mock adapter on the default instance
let mock = new MockAdapter(axios);

const mockStore = configureMockStore();
let initialState = {
    auth: {
        token: null
    },
    global: {
        loading: false
    }
}

let store = mockStore(initialState);
let wrapper;



describe('Login Component', () => {

    beforeEach(() => {
        wrapper = mount(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/']}>
                    <Login />
                </MemoryRouter>
            </Provider>);
    });


    it('should dispatch loading upon form submission', () => {
        const formComponent = wrapper.find('form');
        formComponent.find('#email').instance().value = 'asd@asd.com'
        formComponent.find('#password').instance().value = 'test'
        formComponent.simulate('submit')

        // mock.onPost(global.backendUrl + '/auth/login', {
        //     email: 'asd@asdasd.com',
        //     password: 'test'
        // })

        const expectedActions = [{ type: globalActionTypes.TOGGLE_LOADING }];
        expect(store.getActions()).toEqual(expectedActions)
    })


    it('should display success message upon successful form submission', () => {
        const formComponent = wrapper.find('form');
        formComponent.simulate('submit')
        mock.onPost(global.backendUrl + '/auth/login').reply(200, {
            success: true,
            token: '1231232'
        })

        expect(wrapper.find('.ant-notification')).toBeTruthy();
        console.log(wrapper.find('.ant-notification').debug())

    })

    it('should display email validation if its empty', () => {
        const formComponent = wrapper.find('form');
        formComponent.simulate('submit')
        expect(wrapper.containsMatchingElement(<div className="invalid-feedback">Please choose a email.</div>)).toBeTruthy()
    })

    it('should display password validation if its empty', () => {
        const formComponent = wrapper.find('form');
        formComponent.simulate('submit')
        expect(wrapper.containsMatchingElement(<div className="invalid-feedback">Please enter a your password.</div>)).toBeTruthy()
    })
})