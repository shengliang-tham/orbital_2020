import React, { Component } from 'react';
import { Row, Select, DatePicker, Col, InputNumber, Button } from 'antd';
import Form from 'antd/lib/form/Form';
import axios from 'axios';
import { tradingUrl } from '../../../global-variables';
import './Backtest.scss'
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
// const tailLayout = {
//   wrapperCol: { offset: 10, span: 16 },
// };

const dateFormat = 'DD/MM/YYYY';

class Backtest extends Component {


  onGenerate = async (values) => {
    console.log('Success:', values);

    const startDate = values.dates[0].format(dateFormat)
    const endDate = values.dates[1].format(dateFormat)

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
      <div className="back-test">
        <Form
          {...layout}
          className="ant-advanced-search-form"
          name="basic"
          initialValues={{ remember: true, pips: 1, amount: 2000, risk: 2, ticker: 'EUR_USD', dates: [moment('10//7/2020', dateFormat), moment('13/7/2020', dateFormat)] }}
          onFinish={this.onGenerate}
        >
          <Row gutter={24}>
            <Col xl={{ span: 8 }} xs={{ span: 24 }}>
              <Form.Item
                label="Date range"
                name="dates"
                rules={[{
                  required: true, message: 'Please select the dates'
                }]}
              >
                <RangePicker />
              </Form.Item>
            </Col>
            <Col xl={{ span: 8 }} xs={{ span: 24 }}>
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
            </Col>
            <Col xl={{ span: 8 }} xs={{ span: 24 }}>
              <Form.Item
                label="Stop Loss (pips)"
                name="pips"
                rules={[{
                  required: true, message: 'Please select the pips'
                }]}
              >
                <InputNumber min={1} />
              </Form.Item>
            </Col>
            <Col xl={{ span: 8 }} xs={{ span: 24 }}>
              <Form.Item
                label="Amount to trade"
                name="amount"
                rules={[{
                  required: true, message: 'Please input the amount'
                }]}
              >
                <InputNumber min={1} />
              </Form.Item>
            </Col>
            <Col xl={{ span: 8 }} xs={{ span: 24 }}>
              <Form.Item
                label="Risk"
                name="risk"
                rules={[{
                  required: true, message: 'Please input the risk'
                }]}
              >
                <InputNumber min={1} />
              </Form.Item>
            </Col>
            <Col xl={{ span: 24 }} xs={{ span: 24, offset: 1 }}>
              <Button type="primary" htmlType="submit">
                Generate Report
             </Button>
            </Col>
          </Row>
        </Form>

        <Row>
          {/* <Form
            {...layout}
            name="basic"
            className="ant-advanced-search-form"
            initialValues={{ remember: true }}
            onFinish={this.onGenerate}
          >
            <Col xl={{ span: 8 }} xs={{ span: 24 }}>
              <Form.Item
                label="Date range"
                name="dates"
                rules={[{
                  required: true, message: 'Please select the dates'
                }]}
              >
                <RangePicker />
              </Form.Item>
            </Col>
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
          </Form> */}

        </Row>
        <Row>



        </Row>

      </div>
    );
  }
}

export default Backtest;