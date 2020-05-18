import React, { Component, } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Col,
  Row,
  Divider
} from 'antd';
import Grid from "antd/lib/card/Grid";
import "./Register.scss";
import Logo from "../Logo/Logo";
import { Link } from "react-router-dom";
import { backendUrl } from '../../global-variables';
import axios from 'axios';
import { connect } from 'react-redux'
import * as actionTypes from '../../store/actions/authActions'

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      offset: 8,
    },
  },
};

class Register extends Component {


  render() {

    let onFinish = values => {
      console.log('Received values of form: ', values);
      axios.post(backendUrl + '/auth/register', {
        email: values.email,
        password: values.password
      }).then((response) => {
        localStorage.setItem('token', response.data.token)
        this.props.saveToken(response.data.token);
        this.props.history.push("/home");
      })
    };

    return (
      <div className="Register">
        <Grid>
          <Row>
            <Col xs={6}></Col>
            <Col xs={12}>
              <Logo></Logo>
              <Divider></Divider>
              <Form {...formItemLayout} onFinish={onFinish} >
                {/* <Form.Item
                  name="firstName"
                  label="First Name"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your first name',
                    },
                  ]}
                  hasFeedback
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="lastName"
                  label="Last Name"
                  rules={[
                    {
                      required: true,
                      message: 'Please input your last name',
                    },
                  ]}
                  hasFeedback
                >
                  <Input />
                </Form.Item> */}

                <Form.Item
                  name="email"
                  label="E-mail"
                  rules={[
                    {
                      type: 'email',
                      message: 'The input is not valid E-mail!',
                    },
                    {
                      required: true,
                      message: 'Please input your E-mail!',
                    },
                  ]}
                  hasFeedback>
                  <Input />
                </Form.Item>

                {/* <Form.Item
                  name="tradingExperience"
                  label="Trading Experience"
                  rules={[
                    {
                      required: true,
                      message: 'Please select your experience',
                    },
                  ]}
                  hasFeedback
                >
                  <Select placeholder="Select Experience">
                    <Option value="Beginner">Beginner</Option>
                    <Option value="lessThan5">Less than 5 years</Option>
                    <Option value="5to10">5 to 10 years</Option>
                    <Option value="moreThan10">More than 10 years</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="riskAppetite"
                  label="Risk Appetite"
                  rules={[
                    {
                      required: true,
                      message: 'Please select your risk appetite',
                    },
                  ]}
                  hasFeedback
                >
                  <Select placeholder="Select Risk Appetite">
                    <Option value="giamSiap">Giam Siap</Option>
                    <Option value="okay">Okay Lah</Option>
                    <Option value="lamborgini">Lamborgini here i come</Option>
                  </Select>
                </Form.Item> */}

                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{
                    required: true,
                    message: 'Please input your password!',
                  }]}
                  hasFeedback>
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  name="confirm"
                  label="Confirm Password"
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: 'Please confirm your password!',
                    },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject('The two passwords that you entered do not match!');
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                  <Row>
                    <Col span={12}>
                      <Link to="/">
                        <Button type="primary">
                          Back
                         </Button>
                      </Link>

                    </Col>
                    <Col span={12}>
                      <Button type="primary" htmlType="submit">
                        Register
                 </Button>
                    </Col>
                  </Row>

                </Form.Item>

              </Form>

            </Col>
            <Col xs={6}></Col>
          </Row>
        </Grid>

      </div >


    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    saveToken: (token) => { dispatch({ type: actionTypes.SAVE_TOKEN, payload: token }) }
  }
}

export default connect(null, mapDispatchToProps)(Register);