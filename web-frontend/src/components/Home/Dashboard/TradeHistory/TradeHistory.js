import React, { Component } from 'react';
import { Table, Tag, Space } from 'antd';

const columns = [
    {
        title: 'Stock Name',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
    },
    {
        title: 'Total',
        dataIndex: 'amount',
        key: 'amount',
    },
    {
        title: 'Result',
        dataIndex: 'percentageChanged',
        key: 'percentageChanged',
    },
    {
        title: 'Gain/Loss',
        dataIndex: 'gainLoss',
        key: 'gainLoss',
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
    },

];

const data = [
    {
        key: '1',
        name: 'Apple',
        percentageChanged: "5%",
        amount: "5.00",
        day: "1",
        gainLoss: "-1%",
        date: "2014-12-24 23:12:00"
    },
    {
        key: '2',
        name: 'Google',
        percentageChanged: "2%",
        amount: "115.00",
        day: "2",
        gainLoss: "+5%",
        date: "2014-12-24 23:12:00"
    },
    {
        key: '3',
        name: 'Nasi Babi',
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
                <Table columns={columns} dataSource={data} />
            </div>
        );
    }
}

export default TradeHistory;