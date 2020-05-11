import React, { Component } from 'react';
import { TypeChooser } from "react-stockcharts/lib/helper";
import CandleStickChart from './Candlestick/CandleStickChart';
import { getData } from "./utils"

class Trade extends Component {

    componentDidMount() {
        getData().then(data => {
            console.log(data);
            this.setState({ data })
        })
    }

    render() {
        if (this.state == null) {
            return <div>Loading...</div>
        }
        return (
            <CandleStickChart data={this.state.data} />
        )
    }
}

export default Trade;