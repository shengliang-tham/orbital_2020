import React, { Component } from 'react';
import { Table, Tag, Space, notification } from 'antd';
import axios from 'axios';
import { tradingUrl } from '../../../../global-variables';
import * as globalActionTypes from '../../../../store/actions/globalActions';
import { connect } from 'react-redux';
import './TopPair.scss'

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
        axios.get(tradingUrl + '/getTop3')
            .then(response => {
                console.log(response);
                this.setState({
                    topStocks: response.data
                })
                this.props.toggleLoading();
            })
            .catch(error => {
                notification.error({
                    message: 'Error',
                    description: JSON.parse(JSON.stringify(error)).message,
                    placement: 'bottomRight'
                });
                this.props.toggleLoading();
            })
    }

    render() {
        return (
            <div className="top-pair">
                <div>
                    Top Stocks (Last 24hrs)
                </div>
                <Table columns={columns}
                    dataSource={this.state ? this.state.topStocks : null}
                    rowClassName={(row, index) => { return row.percentageChanged.includes('-') ? "negative-value" : "positive-value" }} />
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        user: state.user.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleLoading: () => { dispatch({ type: globalActionTypes.TOGGLE_LOADING }) },
    }
}



export default connect(mapStateToProps, mapDispatchToProps)(TopPair);