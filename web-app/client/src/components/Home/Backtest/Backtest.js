import React, { Component } from 'react';
import { Row, Select } from 'antd';

class Backtest extends Component {
  render() {
    return (
      <div>
        <Row>
          {/* <Select style={{ width: 200 }} onChange={this.handleTimeChange} placeholder="Select Timeframe" value={this.state.selectedTimeFrame ? this.state.selectedTimeFrame : null}>
            <Option key={index} value={item.value}>{item.display}</Option>
          </Select> */}
        </Row>

      </div>
    );
  }
}

export default Backtest;