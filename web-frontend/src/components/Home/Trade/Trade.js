import React, { Component } from 'react';
import { TypeChooser } from "react-stockcharts/lib/helper";
import CandleStickChart from './Candlestick/CandleStickChart';
import { getData } from "./utils"
import { Select } from 'antd';

const { Option, OptGroup } = Select;

class Trade extends Component {

    componentDidMount() {
        getData().then(data => {
            console.log(data);
            this.setState({ data })
        })
    }

    handleChange = value => {
        console.log(`selected ${value}`);
    }

    render() {
        if (this.state == null) {
            return <div>Loading...</div>
        }
        return (
            <div>
                <Select defaultValue="lucy" style={{ width: 200 }} onChange={this.handleChange}>
                    <OptGroup label="Stocks">
                        <Option value="jack">Apple</Option>
                        <Option value="lucy">Microsoft</Option>
                    </OptGroup>
                    <OptGroup label="Forex">
                        <Option value="Yiminghe">USD/SGD</Option>
                    </OptGroup>
                </Select>
                <CandleStickChart data={this.state.data} />

            </div>
        )
    }
}

export default Trade;