import React from 'react';
import { render } from 'react-dom';
// import Chart from './chart';
// import { getData } from './utils';
import { TypeChooser } from "react-stockcharts/lib/helper";
import CandleStickChart from './Chart/Candlestick/CandleStickChart';
import { getData } from './Chart/CandleStickChartForDiscontinuousIntraDay/util';
import CandleStickChartForDiscontinuousIntraDay from './Chart/CandleStickChartForDiscontinuousIntraDay/CandleStickChartForDiscontinuousIntraDay';


class Trade extends React.Component {



  componentDidMount() {
    getData().then(data => {
      console.log(data)
      this.setState({ data })
    })
  }
  render() {
    if (this.state == null) {
      return <div>Loading...</div>
    }
    return (
      <TypeChooser>
        {type => <CandleStickChartForDiscontinuousIntraDay type={type} data={this.state.data} />}
      </TypeChooser>
    )
  }
}

export default Trade;