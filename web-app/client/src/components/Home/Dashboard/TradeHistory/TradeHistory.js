import React, { Component } from 'react';
import { Table } from 'antd';
import { connect } from 'react-redux';
import Moment from 'react-moment';

const columns = [
    {
        title: 'Ticker',
        dataIndex: 'ticker',
        key: 'ticker',
        responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
        title: 'Price Bought At',
        dataIndex: 'openPrice',
        key: 'openPrice',
        responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
        title: 'Price Closed At',
        dataIndex: 'closePrice',
        key: 'closePrice',
        responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
        title: 'Gain/Loss %',
        dataIndex: 'gain',
        key: 'gain',
        responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        render: date => <Moment format="DD/MM/YYYY HH:MM:SS">{date}</Moment>,
        // responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
        responsive: ['sm'],
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