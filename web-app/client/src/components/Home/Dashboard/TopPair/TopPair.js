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
    render() {
        return (
            <div>
                <div>
                    Top Stocks (Last 24hrs)
                </div>
                <Table columns={columns} dataSource={data} />
            </div>
        );
    }
}

export default TopPair;