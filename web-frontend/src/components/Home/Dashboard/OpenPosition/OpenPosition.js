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
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
    },
    {
        title: 'Cost',
        dataIndex: 'costPrice',
        key: 'costPrice',
    },
    {
        title: '% Change',
        dataIndex: 'percentageChanged',
        key: 'percentageChanged',
    },
    {
        title: 'Day',
        dataIndex: 'day',
        key: 'day',
    },

];

const data = [
    {
        key: '1',
        name: 'Apple',
        percentageChanged: "5%",
        amount: "5.00",
        costPrice: "$5.00",
        day: "1"
    },
    {
        key: '2',
        name: 'Google',
        percentageChanged: "2%",
        amount: "115.00",
        costPrice: "$125.00",
        day: "2"
    },
    {
        key: '3',
        name: 'Nasi Babi',
        percentageChanged: "1%",
        amount: "255.00",
        costPrice: "$25.00",
        day: "3"
    },
];
class OpenPosition extends Component {
    render() {
        return (
            <div>
                <div>
                    Open Positions
                </div>
                <Table columns={columns} dataSource={data} />
            </div>
        );
    }
}

export default OpenPosition;