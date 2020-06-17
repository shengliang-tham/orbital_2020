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
import { tradingUrl, backendUrl } from '../../../global-variables';
import axios from 'axios';
import { timeParse } from "d3-time-format";

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
const lotSize = 100;


class Trade extends React.Component {

  buyModalRef = React.createRef();

  state = {
    buyModalVisible: false,
    stocksArray: [],
    forexArray: [],
    timeFrame: [],
    // chartData: [],
    chartData: [
      {
        "open": 0.765,
        "high": 0.765,
        "low": 0.765,
        "close": 0.765,
        "volume": 0,
        "date": new Date(),
        "RSI": null,
        "MA_20": null,
        "ADX": null,
        "OBV": 0,
        "slope": 0
      },
      {
        "open": 0.765,
        "high": 0.77,
        "low": 0.765,
        "close": 0.765,
        "volume": 193200,
        "date": new Date(),
        "RSI": null,
        "MA_20": null,
        "ADX": null,
        "OBV": -193200,
        "slope": 0
      }],
    startDate: moment(),
    endDate: moment(),
    selectedInstrument: null,
    selectedTimeFrame: null,
    selectedTimeFrameValue: null,
  }



  showBuyModal = () => {
    this.setState({
      buyModalVisible: true,
    });
    console.log(this.buyModalRef)

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

      console.log(this.state)
      const params = {
        ticker: this.state.stocksArray[0].ticker,
        interval: this.state.timeFrame[0].value,
        startDate: this.state.startDate.format(dateFormat),
        endDate: this.state.endDate.format(dateFormat)
      }
      // await this.fetchChart(params);
      // this.buyModalRef.current.setFieldsValue({
      //   accountBalance: 0
      // })

      this.props.toggleLoading();
    } catch (error) {
      console.log(error)
      notification.error({
        message: 'Error',
        description: JSON.parse(JSON.stringify(error)).message,
        placement: 'bottomRight'
      });
      this.props.toggleLoading();
    }
  }


  fetchInstruments = async () => {
    const instruments = await axios.get(tradingUrl + '/instrument-pool')
    console.log(instruments)
    const newstocksArray = instruments.data.filter(obj => {
      return obj.instrument === 'stocks'
    })

    const newforexArray = instruments.data.filter(obj => {
      return obj.instrument === 'forex'
    })

    this.setState({
      ...this.state,
      stocksArray: newstocksArray,
      forexArray: newforexArray,
      selectedInstrument: newstocksArray[0].ticker,
    })
  }

  fetchTimeFrame = async () => {
    const timeFrame = await axios.get(tradingUrl + '/time-pool')
    this.setState({
      ...this.state,
      timeFrame: timeFrame.data,
      selectedTimeFrame: timeFrame.data[0].display,
      selectedTimeFrameValue: timeFrame.data[0].value,
    })
  }

  fetchChart = async (params) => {
    let chartResponse = await getData(params);
    this.setState({
      ...this.state,
      chartData: chartResponse,
    })
    console.log(chartResponse)
  }

  handleStockChange = async (value) => {
    this.props.toggleLoading();
    this.setState({
      ...this.state,
      selectedInstrument: value
    })

    const params = {
      ticker: value,
      interval: this.state.selectedTimeFrameValue,
      startDate: this.state.startDate.format(dateFormat),
      endDate: this.state.endDate.format(dateFormat)
    }
    await this.fetchChart(params);
    this.props.toggleLoading();
  }

  handleTimeChange = async (value, index) => {
    this.props.toggleLoading();
    this.setState({
      ...this.state,
      selectedTimeFrame: value,
      selectedTimeFrameValue: index.value
    })
    const params = {
      ticker: this.state.selectedInstrument,
      interval: index.value,
      startDate: this.state.startDate.format(dateFormat),
      endDate: this.state.endDate.format(dateFormat)
    }
    await this.fetchChart(params);
    this.props.toggleLoading();
  }

  onStartChange = (date, dateString) => {
    console.log(date, dateString);
  }

  onEndChange = (date, dateString) => {
    console.log(date, dateString);
  }
  onBuyModal = async (form) => {
    console.log(form)

    if (form.totalPrice > this.props.user.accountBalance) {
      notification.error({
        message: 'Error',
        description: "Not enough funds",
        placement: 'bottomRight'
      });
    } else {
      const buyOrder = {
        ...form,
        ticker: this.state.selectedInstrument
      }
      console.log(buyOrder)

      const response = await axios.post(backendUrl + '/user/buy-order', buyOrder);


    }

  }

  onBuyModalChange = (changedValues, allValues) => {
    console.log(changedValues)
    console.log(allValues)
    console.log(this.buyModalRef)
    this.buyModalRef.setFieldsValue({ totalPrice: lotSize * allValues.currentPrice * allValues.unit })
  }

  setBuyModalRef = element => {
    this.buyModalRef = element
    // console.log(this.buyModalRef)
    if (this.state.buyModalVisible) {
      this.buyModalRef.setFieldsValue({
        unit: 1,
        lotSize: lotSize,
        currentPrice: this.state.chartData[this.state.chartData.length - 1].open,
        totalPrice: 100 * this.state.chartData[this.state.chartData.length - 1].open,
        accountBalance: this.props.user.accountBalance
      })

    }
  }

  render() {
    return (
      this.state ?
        <div className="trade">
          <Row>
            <Col>
              <Select style={{ width: 200 }} onChange={this.handleStockChange} placeholder="Select Ticker" value={this.state.selectedInstrument ? this.state.selectedInstrument : null}>
                <OptGroup label="Stock">
                  {this.state ? this.state.stocksArray
                    .map((item, index) => <Option key={index} value={item.ticker}>{item.ticker}</Option>) : null}
                </OptGroup>
                <OptGroup label="Forex">
                  {this.state ? this.state.forexArray
                    .map((item, index) => <Option key={index} value={item.ticker}>{item.ticker}</Option>) : null}
                </OptGroup>
              </Select>
            </Col>
            <Col>
              <Select style={{ width: 200 }} onChange={this.handleTimeChange} placeholder="Select Timeframe" value={this.state.selectedTimeFrame ? this.state.selectedTimeFrame : null}>
                {this.state ? this.state.timeFrame
                  .map((item, index) => <Option key={index} value={item.value}>{item.display}</Option>) : null}
              </Select>

            </Col>
            <Col>
              <RangePicker defaultValue={[moment(this.state.startDate, dateFormat), moment(this.state.endDate, dateFormat)]}
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
          <Divider />
          <Row>
            <Col span={4}>
              <Button size="large" shape="round" className="buy-btn" onClick={this.showBuyModal}>Buy</Button>
            </Col>
            <Col span={4}>
              <Button size="large" shape="round" className="sell-btn">Sell</Button>
            </Col>
          </Row>


          <CustomModal visible={this.state.buyModalVisible}
            handleOk={this.handleBuyModalOk}
            handleCancel={this.handleBuyModalCancel}
            title="Buy Order"
            formName="buy-form"

          >
            <Form id='buy-form' onValuesChange={this.onBuyModalChange} onFinish={this.onBuyModal} ref={this.setBuyModalRef}
              // initialValues={{
              //   unit: 1,
              //   lotSize: lotSize,
              //   currentPrice: this.state.chartData[this.state.chartData.length - 1].open,
              //   totalPrice: 100 * this.state.chartData[this.state.chartData.length - 1].open,
              // }}
              {...formItemLayout}>
              <Form.Item
                name="unit"
                label="Unit"
              >
                <InputNumber min={1} value={1} />
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
              <Form.Item
                name="accountBalance"
                label="Account Balance">
                <InputNumber
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  disabled={true}
                />
              </Form.Item>
            </Form>

          </CustomModal>

        </div >

        : null
    )
  }
}


const mapStateToProps = state => {
  return {
    user: state.user.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    toggleLoading: () => { dispatch({ type: globalActionTypes.TOGGLE_LOADING }) },
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Trade);