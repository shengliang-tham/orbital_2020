import React, { Component } from 'react';
import { Table, Tag, Space } from 'antd';
import axios from 'axios';
import { tradingUrl } from '../../../../global-variables';
import * as globalActionTypes from '../../../../store/actions/globalActions';
import { connect } from 'react-redux';

const columns = [
    {
        title: 'Stock Name',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
    },
    {
        title: '% Change',
        dataIndex: 'percentageChanged',
        key: 'percentageChanged',
    },
    {
        title: 'Exchange',
        dataIndex: 'exchange',
        key: 'exchange',
    },

];

const data = [
    {
        key: '1',
        name: 'Apple',
        percentageChanged: "5%",
        exchange: 'Bittrex',
    },
    {

        name: 'Google',
        percentageChanged: "2%",
        exchange: 'Polonex',
        key: '2'
    },
    {

        name: 'Nasi Babi',
        percentageChanged: "1%",
        exchange: 'NUS',
        key: '3'
    },
];

class TopPair extends Component {

    componentDidMount() {
        this.props.toggleLoading();
        axios.get(tradingUrl + '/getTop3').then(response => {
            console.log(response);
            this.setState({
                topStocks: response.data
            })
            this.props.toggleLoading();
        })
    }

    render() {
        return (
            <div>
                <div>
                    Top Stocks (Last 24hrs)
                </div>
                <Table columns={columns} dataSource={this.state ? this.state.topStocks : null} />
            </div>
        );
    }
}


const mapDispatchToProps = dispatch => {
    return {
        toggleLoading: () => { dispatch({ type: globalActionTypes.TOGGLE_LOADING }) },
    }

}

export default connect(null, mapDispatchToProps)(TopPair);