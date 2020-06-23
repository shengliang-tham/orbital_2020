import React, { Component } from 'react';
import { Table, Tag, Space } from 'antd';
import { connect } from 'react-redux';
import axios from 'axios';
import { tradingUrl } from './../../../../global-variables';
import Moment from 'react-moment';

const columns = [
    {
        title: 'Ticker',
        dataIndex: 'ticker',
        key: 'ticker',
    },
    {
        title: 'Price Bought At',
        dataIndex: 'openPrice',
        key: 'openPrice',
    },
    {
        title: 'Price Closed At',
        dataIndex: 'closePrice',
        key: 'closePrice',
    },
    {
        title: 'Gain/Loss %',
        dataIndex: 'gain',
        key: 'gain',
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        render: date => <Moment format="DD/MM/YYYY HH:MM:SS">{date}</Moment>
    },

];

const data = [
    {
        key: '1',
        ticker: 'Apple',
        percentageChanged: "5%",
        amount: "5.00",
        day: "1",
        gainLoss: "-1%",
        date: "2014-12-24 23:12:00"
    },
    {
        key: '2',
        ticker: 'Google',
        percentageChanged: "2%",
        amount: "115.00",
        day: "2",
        gainLoss: "+5%",
        date: "2014-12-24 23:12:00"
    },
    {
        key: '3',
        ticker: 'Nasi Babi',
        percentageChanged: "1%",
        amount: "255.00",
        day: "3",
        gainLoss: "+5%",
        date: "2014-12-24 23:12:00"
    },
];
class TradeHistory extends Component {

    render() {
        return (
            <div>
                <div>
                    Trade History
                </div>
                <Table columns={columns} rowKey='_id' dataSource={this.props.user ? this.props.user.transactionHistory : null} />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
    }
}

export default connect(mapStateToProps)(TradeHistory);