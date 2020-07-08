import React, { Component } from 'react';
import { Row, Select, DatePicker, Col, InputNumber } from 'antd';
import Form from 'antd/lib/form/Form';

const { Option } = Select;
const { RangePicker } = DatePicker;

const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};


class Backtest extends Component {

  handleChange = (value) => {
    console.log(`selected ${value}`);
  }

  onFinish = values => {
    console.log('Success:', values);
  };

  onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };


  render() {

    return (
      <div>

        <Row>

          <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
          >

            <Form.Item
              label="Date range"
              name="dates"
              rules={[{
                required: true, message: 'Please select the dates'
              }]}
            >
              <RangePicker />
            </Form.Item>

            <Form.Item
              label="Select Tickers"
              name="ticker"
              rules={[{
                required: true, message: 'Please select the ticker'
              }]}
            >
              <Select defaultValue="EUR_USD" style={{ width: 120 }} onChange={this.handleChange}>
                <Option value="EUR_USD">EUR_USD</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Stop Loss (pips)"
              name="pips"
              rules={[{
                required: true, message: 'Please select the pips'
              }]}
            >
              <InputNumber min={1} />
            </Form.Item>

            <Form.Item
              label="Amount to trade"
              name="amount"
              rules={[{
                required: true, message: 'Please input the amount'
              }]}
            >
              <InputNumber min={1} />
            </Form.Item>

            <Form.Item
              label="Risk"
              name="risk"
              rules={[{
                required: true, message: 'Please input the risk'
              }]}
            >
              <InputNumber min={1} />
            </Form.Item>
          </Form>

        </Row>
        <Row>



        </Row>

      </div>
    );
  }
}

export default Backtest;