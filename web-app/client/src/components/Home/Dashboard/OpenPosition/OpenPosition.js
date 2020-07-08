import React, { Component } from 'react';
import { Table, Tag, Space, Button, InputNumber, Input } from 'antd';
import './OpenPosition.scss';
import { connect } from "react-redux";
import CustomModal from '../../../../UI/Modal/Modal';
import Form from 'antd/lib/form/Form';
import axios from 'axios'
import { backendUrl } from '../../../../global-variables';
import { notification } from 'antd';

import * as globalActionTypes from '../../../../store/actions/globalActions';
import * as userActionTypes from '../../../../store/actions/userActions';
import Moment from 'react-moment';

const formItemLayout = {
    labelCol: {
        xs: { span: 8 },
        sm: { span: 8 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
    },
};

class OpenPosition extends Component {

    state = {
        sellModalVisible: false,
        selectedInstrument: null
    }

    columns = [
        {
            title: 'Ticker',
            dataIndex: 'ticker',
            key: 'ticker',
            render: text => <a>{text}</a>,
            responsive: ['md', 'lg'],
        },
        {
            title: 'Price Bought At',
            dataIndex: 'openPrice',
            key: 'openPrice',
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
        {
            title: 'Action',
            key: 'action',
            render: (instrument) => (
                <Button onClick={() => this.showSellModal(instrument)}>
                    Sell
                </Button>

            ),
        },

    ];

    showSellModal = (instrument) => {
        this.setState({
            sellModalVisible: true,
            selectedInstrument: instrument
        });
        console.log(instrument)

    }

    handleSellModalCancel = () => {
        this.setState({
            sellModalVisible: false,
        });
    }

    setSellModalRef = element => {
        this.sellModalRef = element
        if (this.state.sellModalVisible) {
            console.log(this.state)
            this.sellModalRef.setFieldsValue({
                unit: this.state.selectedInstrument.units,
                lotSize: this.state.selectedInstrument.lotSize,
                openPrice: this.state.selectedInstrument.openPrice,
                sellPrice: this.state.selectedInstrument.currentPrice,
                gain: this.state.selectedInstrument.gain
            })

        }
    }
    onSellModal = async (form) => {
        console.log(form)

        try {
            const sellOrder = {
                ...form,
                ticker: this.state.selectedInstrument.ticker,
                units: this.state.selectedInstrument.unit,
                openPrice: this.state.selectedInstrument.openPrice,
                closePrice: this.state.selectedInstrument.currentPrice,
                lotSize: this.state.selectedInstrument.lotSize,
                totalPrice: this.state.selectedInstrument.currentPrice * this.state.selectedInstrument.lotSize * this.state.selectedInstrument.unit,
                selectedInstrumentId: this.state.selectedInstrument._id,
                gain: (Math.round(this.state.selectedInstrument.gain * 100 + Number.EPSILON) / 100)
            }

            const response = await axios.post(backendUrl + '/user/sell-order', sellOrder);
            if (response.data.success) {
                notification.success({
                    message: 'Success',
                    description: "Successfully Sold",
                    placement: 'bottomRight'
                });

                this.setState({
                    sellModalVisible: false,
                });
                this.props.updateUser(response.data.user)

            } else {
                notification.error({
                    message: 'Error',
                    description: response.data.message,
                    placement: 'bottomRight'
                });
            }
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error,
                placement: 'bottomRight'
            });
        }
    }

    render() {
        return (
            <div>
                <div>
                    Open Positions
                </div>
                <Table columns={this.columns} rowKey='_id' dataSource={this.props.user ? this.props.user.openPosition.filter(item => item.status === 'open') : null} />

                <CustomModal visible={this.state.sellModalVisible}
                    handleOk={this.handleSellModalOk}
                    handleCancel={this.handleSellModalCancel}
                    title="Sell Order"
                    formName="sell-form"
                >
                    <Form id='sell-form' onFinish={this.onSellModal} ref={this.setSellModalRef}
                        {...formItemLayout}>
                        <Form.Item
                            name="unit"
                            label="Unit"
                        >
                            <Input disabled={true} />
                        </Form.Item>
                        <Form.Item
                            name="lotSize"
                            label="Lot Size">
                            <Input disabled={true} />
                        </Form.Item>
                        <Form.Item
                            name="openPrice"
                            label="Price you bought at">
                            <Input disabled={true} />
                        </Form.Item>
                        <Form.Item
                            name="sellPrice"
                            label="Current Price">
                            <Input disabled={true} />
                        </Form.Item>
                        <Form.Item
                            name="gain"
                            label="Net Gain">
                            <Input disabled={true} />
                        </Form.Item>
                    </Form>

                </CustomModal>
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
        updateUser: (user) => { dispatch({ type: userActionTypes.UPDATE_USER_DETAILS, payload: user }) }
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(OpenPosition);