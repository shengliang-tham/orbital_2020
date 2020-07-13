import React, { Component } from 'react';
import { Row, Select, DatePicker, Col, InputNumber, Button, Timeline, Divider, Popover, Statistic, Tooltip } from 'antd';
import Form from 'antd/lib/form/Form';
import axios from 'axios';
import { tradingUrl } from '../../../global-variables';
import './Backtest.scss'
import moment from 'moment';
import { InfoCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import * as globalActionTypes from '../../../store/actions/globalActions';

const { Option } = Select;
const { RangePicker } = DatePicker;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
// const tailLayout = {
//   wrapperCol: { offset: 10, span: 16 },
// };

const popoverTitle = `What is this?`;

const backTestingPopover = `Backtesting is a method for seeing how well a strategy would have done for historical data.
For indomie autotrading and back testing feature. We are using a crossover moving average straregy
where the moving average over the span of 50 (MA50) cross the moving average over the span of 100 (MA100) to indicate certain buy/sell signals.
Based on the your input, the application will generate the results. `;

const riskPopover = `How much percent of your account do you want to risk per trade? Values range from 1 to 100%. Recommend is < 5%`;

const pipsPopover = `How much pips (4 decimal place) are u willing to lose`;

const dateFormat = 'DD/MM/YYYY';

class Backtest extends Component {

  state = {
    backtestData: [],
    profit: 0
  }

  onGenerate = async (values) => {
    this.props.toggleLoading();
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
    this.setState({
      ...this.state,
      backtestData: response.data
    })

    this.props.toggleLoading();
  };

  render() {

    return (
      <div className="back-test">

        <Form
          {...layout}
          className="ant-advanced-search-form"
          name="basic"
          initialValues={{ remember: true, pips: 2, amount: 2000, risk: 2, ticker: 'EUR_USD', dates: [moment('10//7/2020', dateFormat), moment('13/7/2020', dateFormat)] }}
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
              <Form.Item label="Stop Loss (pips)">
                <Form.Item
                  name="pips"
                  noStyle
                  rules={[{
                    required: true, message: 'Please select the pips'
                  }]}
                >
                  <InputNumber min={1} />
                </Form.Item>

                <Tooltip title={pipsPopover}>
                  <span className="help">
                    <QuestionCircleOutlined />
                  </span>
                </Tooltip>
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
              <Form.Item label="Risk">
                <Form.Item
                  name="risk"
                  noStyle
                  rules={[{
                    required: true, message: 'Please input the risk'
                  }]}
                >
                  <InputNumber min={1} max={100} />
                </Form.Item>
                <Tooltip title={riskPopover}>
                  <span className="help">
                    <QuestionCircleOutlined />
                  </span>
                </Tooltip>
              </Form.Item>
            </Col>

            <Col xl={{ span: 24 }} xs={{ span: 24, offset: 1 }}>
              <Tooltip title={backTestingPopover}>
                <Button type="primary" htmlType="submit">
                  Generate Report
             </Button>
              </Tooltip>

            </Col>

          </Row>
        </Form>
        <Divider />
        <Row>

          {this.state.backtestData ? this.state.backtestData.map((item, key) =>

            <Col xl={{ span: 6, offset: 1 }} key={key}>
              <Timeline className="time-line">
                <Timeline.Item color="CornflowerBlue">Execute Purchase Order {item['Opening Time']}</Timeline.Item>
                <Timeline.Item color="blue" dot={<InfoCircleOutlined style={{ fontSize: '16px' }} />}>
                  <p>Entry Price : ${item['Entry Price']}</p>
                  <p>Closing Price : ${item['Closing Price']}</p>
                </Timeline.Item>
                <Timeline.Item color="red">
                  <p>Profit : {item['Profit']}</p>
                </Timeline.Item>
                <Timeline.Item color="CornflowerBlue">Execute Sell Order {item['Ending Time']}</Timeline.Item>
              </Timeline>
            </Col>

          ) : null}
        </Row>
        <Divider />
        {this.state.backTestData ?

          <Row>
            <Statistic title="Active Users" value={112893} />
          </Row>

          : null}
      </div >
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    toggleLoading: () => { dispatch({ type: globalActionTypes.TOGGLE_LOADING }) },
  }

}

export default connect(null, mapDispatchToProps)(Backtest);