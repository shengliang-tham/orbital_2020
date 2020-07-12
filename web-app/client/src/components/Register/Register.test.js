import '../../mocks/matchMedia';

import React from 'react';

import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';

import { console } from '../../mocks/matchMedia';
import Register from './Register';

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
                <MemoryRouter initialEntries={['/register']}>
                    <Register />
                </MemoryRouter>
            </Provider>);
    });
})