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

class Trade extends React.Component {
  state = {
    buyModalVisible: false,
  }


  showBuyModal = () => {
    this.setState({
      buyModalVisible: true,
    });
  }

  handleBuyModalOk = () => {

  }

  handleBuyModalCancel = () => {
    this.setState({
      buyModalVisible: false,
    });
  }

  componentDidMount() {
    // this.props.toggleLoading();
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
              <Select style={{ width: 200 }} onChange={this.handleChange} placeholder="Select Ticker">
                <OptGroup label="Stock">
                  <Option value="5BI.SI">5BI.SI</Option>
                  <Option value="ARIA.SI">ARIA.SI</Option>
                </OptGroup>
                <OptGroup label="Forex">
                  <Option value="SGD/USB">SGD/USD</Option>
                  <Option value="USD/GBP">USD/GBP</Option>
                </OptGroup>
              </Select>
            </Col>
            <Col>
              <Select style={{ width: 200 }} onChange={this.handleChange} placeholder="Select Timeframe">
                <Option value="5BI.SI">1 min</Option>
                <Option value="ARIA.SI">5 min</Option>
                <Option value="ARIA.SI">15 min</Option>
                <Option value="ARIA.SI">30 min</Option>
                <Option value="ARIA.SI">60 min</Option>
                <Option value="ARIA.SI">Daily</Option>
                <Option value="ARIA.SI">Weekly</Option>
                <Option value="ARIA.SI">Monthly</Option>
              </Select>

            </Col>
            <Col>
              <RangePicker />
            </Col>
          </Row>
          <Divider />
          <Row>
            {/* <Col span={24}>
              < TypeChooser >
                {type => < CandleStickChartForDiscontinuousIntraDay type={type} data={this.state.data} />}
              </TypeChooser>
            </Col> */}
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