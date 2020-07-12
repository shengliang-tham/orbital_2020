import React, { Component } from 'react';
import { Row, Select, DatePicker, Col, InputNumber, Button } from 'antd';
import Form from 'antd/lib/form/Form';
import axios from 'axios';
import { tradingUrl } from '../../../global-variables';

const { Option } = Select;
const { RangePicker } = DatePicker;

const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 10, span: 16 },
};

const dateFormat = 'D/MM/YYYY';

class Backtest extends Component {


  onGenerate = async (values) => {
    console.log('Success:', values);

    const response = await axios.get(tradingUrl + '/backtestForex_Summary', {
      params: {
        't_Start': values.dates[0].format(dateFormat),
        't_End': values.dates[1].format(dateFormat),
        'Symbol': values.ticker,
        'SLpips': values.pips,
        'balance': values.amount,
        'risk': values.risk
      }
    })

    console.log(response)
  };

  render() {

    return (
      <div>

        <Row>

          <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={this.onGenerate}
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
              <Select style={{ width: 120 }} >
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

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Submit
             </Button>
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