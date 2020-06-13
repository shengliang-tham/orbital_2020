import React from 'react';
import { render } from 'react-dom';
// import Chart from './chart';
// import { getData } from './utils';
import { TypeChooser } from "react-stockcharts/lib/helper";
import CandleStickChart from './Chart/Candlestick/CandleStickChart';
import { getData } from './Chart/CandleStickChartForDiscontinuousIntraDay/util';
import CandleStickChartForDiscontinuousIntraDay from './Chart/CandleStickChartForDiscontinuousIntraDay/CandleStickChartForDiscontinuousIntraDay';
import { connect } from 'react-redux';
import * as globalActionTypes from '../../../store/actions/globalActions';
import { Select, Row, Col, Divider, notification, DatePicker, Button, Input, InputNumber } from 'antd';
import './Trade.scss';
import CustomModal from './../../../UI/Modal/Modal';
import Form from 'antd/lib/form/Form';
import moment from 'moment';
import { tradingUrl } from '../../../global-variables';
import axios from 'axios';

const { Option, OptGroup } = Select;
const { RangePicker } = DatePicker;


const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};


const dateFormat = 'D/MM/YYYY';


class Trade extends React.Component {
  state = {
    buyModalVisible: false,
    defaultStocks: [],
    defaultForex: [],
    timeFrame: [],
    chartData: []
  }


  showBuyModal = () => {
    this.setState({
      buyModalVisible: true,
    });
  }

  handleBuyModalCancel = () => {
    this.setState({
      buyModalVisible: false,
    });
  }

  async componentDidMount() {
    try {
      this.props.toggleLoading();

      await this.fetchInstruments();
      await this.fetchTimeFrame();

      const params = {
        ticker: this.state.defaultStocks[0].ticker,
        interval: this.state.timeFrame[0].value,
        startDate: moment().subtract(1, 'days').format(dateFormat),
        endDate: moment().format(dateFormat),
      }

      const chartResponse = await getData(params);
      this.setState({
        ...this.state,
        chartData: chartResponse
      })

      console.log(this.state)
      this.props.toggleLoading();
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error,
        placement: 'bottomRight'
      });
      this.props.toggleLoading();
    }



    // getData()
    //   .then(data => {
    //     console.log(data)
    //     this.setState({ data })

    //     console.log(this.state)
    //     this.props.toggleLoading();
    //   })
    //   .catch(error => {
    //     notification.error({
    //       message: 'Error',
    //       description: JSON.parse(JSON.stringify(error)).message,
    //       placement: 'bottomRight'
    //     });
    //     this.props.toggleLoading();
    //   })
    console.log(this.state)
  }


  fetchInstruments = async () => {
    const instruments = await axios.get(tradingUrl + '/instrument-pool')
    const newDefaultStocks = instruments.data.filter(obj => {
      return obj.instrument === 'stocks'
    })

    const newDefaultForex = instruments.data.filter(obj => {
      return obj.instrument === 'forex'
    })

    this.setState({
      ...this.state,
      defaultStocks: newDefaultStocks,
      defaultForex: newDefaultForex
    })
  }

  fetchTimeFrame = async () => {
    const timeFrame = await axios.get(tradingUrl + '/time-pool')
    this.setState({
      ...this.state,
      timeFrame: timeFrame.data
    })
  }


  handleChange = (value) => {
    console.log(`selected ${value}`);
  }

  onStartChange = (date, dateString) => {
    console.log(date, dateString);
  }

  onEndChange = (date, dateString) => {
    console.log(date, dateString);
  }

  onUnitChange = (value) => {
    console.log('changed', value);
  }

  render() {
    return (
      this.state ?
        <div className="trade">
          <Row>
            <Col>
              <Select style={{ width: 200 }} onChange={this.handleChange} placeholder="Select Ticker" value={this.state.defaultStocks.length ? this.state.defaultStocks[0].ticker : null}>
                <OptGroup label="Stock">
                  {this.state ? this.state.defaultStocks
                    .map((item, index) => <Option key={index} value={item.ticker}>{item.ticker}</Option>) : null}
                </OptGroup>
                <OptGroup label="Forex">
                  {this.state ? this.state.defaultForex
                    .map((item, index) => <Option key={index} value={item.ticker}>{item.ticker}</Option>) : null}
                </OptGroup>
              </Select>
            </Col>
            <Col>
              <Select style={{ width: 200 }} onChange={this.handleChange} placeholder="Select Timeframe" value={this.state.timeFrame.length ? this.state.timeFrame[0].display : null}>
                {this.state ? this.state.timeFrame
                  .map((item, index) => <Option key={index} value={item.value}>{item.display}</Option>) : null}
              </Select>

            </Col>
            <Col>
              <RangePicker defaultValue={[moment(moment().subtract(1, 'days'), dateFormat), moment(moment(), dateFormat)]}
                format={dateFormat} />
            </Col>
          </Row>
          <Divider />
          <Row>


            {
              this.state.chartData.length ? <Col span={24}>
                < TypeChooser >
                  {type => < CandleStickChartForDiscontinuousIntraDay type={type} data={this.state.chartData} />}
                </TypeChooser>
              </Col>
                : null}

          </Row>
          <Row>
            <Button size="large" shape="round" className="buy-btn" onClick={this.showBuyModal}>Buy</Button>
            <Button size="large" shape="round" className="sell-btn">Sell</Button>
          </Row>


          <CustomModal visible={this.state.buyModalVisible}
            handleOk={this.handleBuyModalOk}
            handleCancel={this.handleBuyModalCancel}
            title="Buy Order"
            formName="buy-form"
          >
            <Form id='buy-form' onFinish={this.onEmailUpdate} initialValues={{ unit: 1, lotSize: 100, currentPrice: 100, totalPrice: 100 }} {...formItemLayout}>
              <Form.Item
                name="unit"
                label="Unit"
              >
                <InputNumber min={1} value={1} onChange={this.onUnitChange} />
              </Form.Item>
              <Form.Item
                name="lotSize"
                label="Lot Size">
                <Input disabled={true} />
              </Form.Item>
              <Form.Item
                name="currentPrice"
                label="Current Price">
                <Input disabled={true} />
              </Form.Item>
              <Form.Item
                name="totalPrice"
                label="Total Price">
                <Input disabled={true} />
              </Form.Item>
            </Form>

          </CustomModal>

        </div >

        : null
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    toggleLoading: () => { dispatch({ type: globalActionTypes.TOGGLE_LOADING }) },
  }
}
export default connect(null, mapDispatchToProps)(Trade);