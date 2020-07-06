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
import * as userActionTypes from '../../../store/actions/userActions';
import { Select, Row, Col, Divider, notification, DatePicker, Button, Input, InputNumber, message } from 'antd';
import './Trade.scss';
import CustomModal from './../../../UI/Modal/Modal';
import Form from 'antd/lib/form/Form';
import moment from 'moment';
import { tradingUrl, backendUrl } from '../../../global-variables';
import axios from 'axios';
import { timeParse } from "d3-time-format";
import TradingView from './Chart/TradingView/TradingView';

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
    chartData: [],
    // chartData: [
    //   {
    //     "open": 0.765,
    //     "high": 0.765,
    //     "low": 0.765,
    //     "close": 0.765,
    //     "volume": 0,
    //     "date": new Date(),
    //     "RSI": null,
    //     "MA_20": null,
    //     "ADX": null,
    //     "OBV": 0,
    //     "slope": 0
    //   },
    //   {
    //     "open": 0.765,
    //     "high": 0.77,
    //     "low": 0.765,
    //     "close": 0.765,
    //     "volume": 193200,
    //     "date": new Date(),
    //     "RSI": null,
    //     "MA_20": null,
    //     "ADX": null,
    //     "OBV": -193200,
    //     "slope": 0
    //   }],
    startDate: moment(),
    endDate: moment(),
    selectedInstrument: null,
    selectedType: null,
    selectedTimeFrame: null,
    selectedTimeFrameValue: null,
    disabledButtons: false,
    currentPrice: []
  }



  showBuyModal = async () => {
    this.props.toggleLoading();
    // const todayDate = moment().format(dateFormat);
    const todayDate = moment('07/02/2020').format(dateFormat)
    console.log(`${tradingUrl}/${this.state.selectedType}OHLC?ticker=${this.state.selectedInstrument}&interval=1&startDate=${todayDate}&endDate=${todayDate}`)
    const response = await axios(`${tradingUrl}/${this.state.selectedType}OHLC?ticker=${this.state.selectedInstrument}&interval=1&startDate=${todayDate}&endDate=${todayDate}`)
    console.log(response)
    if (response.data.success) {

      this.setState({
        buyModalVisible: true,
        currentPrice: response.data.data[response.data.data.length - 1]
      });
    }

    this.props.toggleLoading();
    console.log(this.state)

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

      // const params = {
      //   ticker: this.state.stocksArray[0].ticker,
      //   interval: this.state.timeFrame[0].value,
      //   startDate: this.state.startDate.format(dateFormat),
      //   endDate: this.state.endDate.format(dateFormat),
      //   selectedType: this.state.type
      // }

      // await this.fetchChart(params);

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
    const newstocksArray = instruments.data.filter(obj => {
      return obj.instrument === 'stock'
    })

    const newforexArray = instruments.data.filter(obj => {
      return obj.instrument === 'forex'
    })

    console.log(newstocksArray)
    this.setState({
      ...this.state,
      stocksArray: newstocksArray,
      forexArray: newforexArray,
      selectedInstrument: newstocksArray[0].ticker,
      selectedType: newstocksArray[0].instrument
    })
  }

  fetchTimeFrame = async () => {
    const timeFrame = await axios.get(tradingUrl + '/time-pool')
    console.log(timeFrame)
    this.setState({
      ...this.state,
      timeFrame: timeFrame.data,
      selectedTimeFrame: timeFrame.data[0].display,
      selectedTimeFrameValue: timeFrame.data[0].value,
    })
  }

  fetchChart = async (params) => {
    let chartResponse = await getData(params);
    console.log(chartResponse)
    if (chartResponse.success) {
      this.setState({
        ...this.state,
        chartData: chartResponse.data,
      })
    } else {
      console.log(chartResponse)
      notification.error({
        message: 'Error',
        description: chartResponse.message,
        placement: 'bottomRight'
      });
    }


  }

  handleInstrumentChange = async (value, index) => {
    this.props.toggleLoading();

    let category = this.state.stocksArray.find(stock => stock.ticker === value)
    let instrumentType;
    if (category) {
      instrumentType = "stock"
    } else {
      instrumentType = "forex"
    }

    this.setState({
      ...this.state,
      selectedInstrument: value,
      selectedType: instrumentType
    })
    this.props.toggleLoading();

  }

  handleTimeChange = async (value, index) => {
    this.props.toggleLoading();
    this.setState({
      ...this.state,
      selectedTimeFrame: value,
      selectedTimeFrameValue: index.value
    })
    this.props.toggleLoading();

  }

  // handleInstrumentChange = async (value, index) => {
  //   this.props.toggleLoading();
  //   this.setState({
  //     ...this.state,
  //     selectedInstrument: value
  //   })

  //   let category = this.state.stocksArray.find(stock => stock.ticker === value)
  //   let instrumentType;
  //   if (category) {
  //     instrumentType = "stock"
  //   } else {
  //     instrumentType = "forex"
  //   }

  //   const params = {
  //     ticker: value,
  //     interval: this.state.selectedTimeFrameValue,
  //     startDate: this.state.startDate.format(dateFormat),
  //     endDate: this.state.endDate.format(dateFormat),
  //     type: instrumentType
  //   }


  //   await this.fetchChart(params);
  //   this.props.toggleLoading();
  // }

  // handleTimeChange = async (value, index) => {
  //   this.props.toggleLoading();
  //   this.setState({
  //     ...this.state,
  //     selectedTimeFrame: value,
  //     selectedTimeFrameValue: index.value
  //   })
  //   const params = {
  //     ticker: this.state.selectedInstrument,
  //     interval: index.value,
  //     startDate: this.state.startDate.format(dateFormat),
  //     endDate: this.state.endDate.format(dateFormat),
  //     type: this.state.type
  //   }
  //   await this.fetchChart(params);
  //   this.props.toggleLoading();
  // }

  // dateOnChange = async (dateArray) => {
  //   console.log(dateArray)
  //   this.props.toggleLoading();

  //   this.setState({
  //     ...this.state,
  //     startDate: dateArray[0],
  //     endDate: dateArray[1],
  //   })

  //   const params = {
  //     ticker: this.state.selectedInstrument,
  //     interval: this.state.selectedTimeFrameValue,
  //     startDate: dateArray[0].format(dateFormat),
  //     endDate: dateArray[1].format(dateFormat),
  //     type: this.state.type
  //   }
  //   await this.fetchChart(params);
  //   this.props.toggleLoading();
  // }

  onBuyModal = async (form) => {
    console.log(form)
    if (form.totalPrice > this.props.user.accountBalance) {
      notification.error({
        message: 'Error',
        description: "Not enough funds",
        placement: 'bottomRight'
      });
    } else {
      const msgIndicator = message.loading('Executing Purchase Order...', 0);

      const buyOrder = {
        ...form,
        ticker: this.state.selectedInstrument
      }

      const response = await axios.post(backendUrl + '/user/buy-order', buyOrder);
      if (response.data.success) {
        notification.success({
          message: 'Success',
          description: "Successfully Purchased",
          placement: 'bottomRight'
        });
      }


      msgIndicator();
      this.setState({
        buyModalVisible: false,
      });
      this.props.updateUser(response.data.user);

    }

  }

  onBuyModalChange = (changedValues, allValues) => {
    this.buyModalRef.setFieldsValue({ totalPrice: lotSize * allValues.currentPrice * allValues.unit })
  }

  setBuyModalRef = async (element) => {
    this.buyModalRef = element
    if (this.state.buyModalVisible) {

      this.buyModalRef.setFieldsValue({
        unit: 1,
        lotSize: lotSize,
        currentPrice: this.state.currentPrice.open,
        totalPrice: 100 * this.state.currentPrice.open,
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
              <Select style={{ width: 200 }} onChange={this.handleInstrumentChange} placeholder="Select Ticker" value={this.state.selectedInstrument ? this.state.selectedInstrument : null}>
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
            {/* <Col>
              <RangePicker defaultValue={[moment(this.state.startDate, dateFormat), moment(this.state.endDate, dateFormat)]}
                onChange={this.dateOnChange}
                format={dateFormat} />
            </Col> */}
          </Row>
          <Divider />
          {/* {
            this.state.chartData.length ?
              <div>
                <Row>

                  <Col span={24}>
                    < TypeChooser >
                      {type => < CandleStickChartForDiscontinuousIntraDay type={type} data={this.state.chartData} />}
                    </TypeChooser>
                  </Col>


                </Row>
                <Divider />

                <Row>
                  <Col span={4}>
                    <Button size="large" shape="round" className="buy-btn" onClick={this.showBuyModal}>Buy</Button>
                  </Col>
                </Row>
              </div>
              : null} */}

          <TradingView instrument={this.state.selectedInstrument} timeframe={this.state.selectedTimeFrameValue} />
          <Button size="large" shape="round" className="buy-btn" onClick={this.showBuyModal}>Buy</Button>

          <CustomModal visible={this.state.buyModalVisible}
            handleOk={this.handleBuyModalOk}
            handleCancel={this.handleBuyModalCancel}
            title="Buy Order"
            formName="buy-form"
            disabledOk={this.state.disabledButtons}
            disabledCancel={this.state.disabledButtons}
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
    updateUser: (user) => { dispatch({ type: userActionTypes.UPDATE_USER_DETAILS, payload: user }) }
  }

}
export default connect(mapStateToProps, mapDispatchToProps)(Trade);