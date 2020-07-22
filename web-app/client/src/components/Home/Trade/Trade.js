import React from 'react';
import { connect } from 'react-redux';
import * as globalActionTypes from '../../../store/actions/globalActions';
import * as userActionTypes from '../../../store/actions/userActions';
import { Select, Row, Col, Divider, notification, Button, Input, InputNumber, message } from 'antd';
import './Trade.scss';
import CustomModal from './../../../UI/Modal/Modal';
import Form from 'antd/lib/form/Form';
import moment from 'moment';
import { tradingUrl, backendUrl } from '../../../global-variables';
import axios from 'axios';
import TradingView from './Chart/TradingView/TradingView';

const { Option, OptGroup } = Select;


const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
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
    const todayDate = moment().format(dateFormat);

    try {
      const response = await axios(`${tradingUrl}/${this.state.selectedType}OHLC?ticker=${this.state.selectedInstrument}&interval=1&startDate=${todayDate}&endDate=${todayDate}`)
      if (response.data.success) {
        this.setState({
          buyModalVisible: true,
          currentPrice: response.data.data[response.data.data.length - 1]
        });
      }
    } catch (error) {

      notification.error({
        message: 'Error',
        description: JSON.stringify(error).message,
        placement: 'bottomRight'
      });
    }

    this.props.toggleLoading();

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

    } catch (error) {
      notification.error({
        message: 'Error',
        description: JSON.parse(JSON.stringify(error)).message,
        placement: 'bottomRight'
      });
    }

    this.props.toggleLoading();

  }


  fetchInstruments = async () => {
    try {

      const instruments = await axios.get(tradingUrl + '/instrument-pool')
      const newstocksArray = instruments.data.filter(obj => {
        return obj.instrument === 'stock'
      })

      const newforexArray = instruments.data.filter(obj => {
        return obj.instrument === 'forex'
      })

      this.setState({
        ...this.state,
        stocksArray: newstocksArray,
        forexArray: newforexArray,
        selectedInstrument: newstocksArray[0].ticker,
        selectedType: newstocksArray[0].instrument
      })

    } catch (error) {

      notification.error({
        message: 'Error',
        description: JSON.stringify(error).message,
        placement: 'bottomRight'
      });
    }

  }

  fetchTimeFrame = async () => {
    try {

      const timeFrame = await axios.get(tradingUrl + '/time-pool')
      this.setState({
        ...this.state,
        timeFrame: timeFrame.data,
        selectedTimeFrame: timeFrame.data[0].display,
        selectedTimeFrameValue: timeFrame.data[0].value,
      })

    } catch (error) {

      notification.error({
        message: 'Error',
        description: JSON.stringify(error).message,
        placement: 'bottomRight'
      });
    }

  }

  handleInstrumentChange = (value, index) => {
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

  handleTimeChange = (value, index) => {
    this.props.toggleLoading();
    this.setState({
      ...this.state,
      selectedTimeFrame: value,
      selectedTimeFrameValue: index.value
    })
    this.props.toggleLoading();

  }

  onBuyModal = async (form) => {

    if (form.totalPrice > this.props.user.accountBalance) {

      notification.error({
        message: 'Error',
        description: "Not enough funds",
        placement: 'bottomRight'
      });

    } else {

      try {
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

      } catch (error) {

        notification.error({
          message: 'Error',
          description: JSON.stringify(error).message,
          placement: 'bottomRight'
        });

      }

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
              <Select style={{ width: '100%' }} onChange={this.handleInstrumentChange} placeholder="Select Ticker" value={this.state.selectedInstrument ? this.state.selectedInstrument : null}>
                <OptGroup label="Stock">
                  {this.state ? this.state.stocksArray
                    .map((item, index) => <Option key={index} value={item.ticker}>{item.ticker_name}</Option>) : null}
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
          </Row>

          <Divider />

          <TradingView instrument={this.state.selectedInstrument} timeframe={this.state.selectedTimeFrameValue} />
          <Divider />
          <Button size="large" className="buy-btn" onClick={this.showBuyModal}>Buy Instrument</Button>

          <CustomModal visible={this.state.buyModalVisible}
            handleOk={this.handleBuyModalOk}
            handleCancel={this.handleBuyModalCancel}
            title="Buy Order"
            formName="buy-form"
            disabledOk={this.state.disabledButtons}
            disabledCancel={this.state.disabledButtons}
          >
            <Form id='buy-form' onValuesChange={this.onBuyModalChange} onFinish={this.onBuyModal} ref={this.setBuyModalRef}
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
                  style={{ width: '100%' }}
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