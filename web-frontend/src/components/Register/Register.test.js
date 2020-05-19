// import React from 'react'
// import { configure, shallow } from 'enzyme'
// import Adapter from 'enzyme-adapter-react-16'
// import Register from './Register'
// import FormItem from 'antd/lib/form/FormItem'
// import { Provider } from "react-redux";
// import configureMockStore from "redux-mock-store";

// const mockStore = configureMockStore();
// const store = mockStore({});

// configure({
//     adapter: new Adapter()
// })

// describe('Register Component', () => {
//     it('should display error if email is not valid', () => {
//         const wrapper = shallow(
//             <Provider store={store}>
//                 <Register />
//             </Provider>);
//         const emailInput = wrapper.find(<FormItem name="email" />).get(0);
//         emailInput.value = 'test';
//         expect(wrapper.find('<div>The input is not valid E-mail!</div>').toHaveLength(1))
//     })
// })