import React, { Component } from 'react';
import { Statistic, Row, Col } from 'antd';
import './Balance.scss';
import { connect } from "react-redux";

class Balance extends Component {

    render() {
        return (
            <div className="Balance">
                <Row gutter={16} justify="center">
                    <Col span={12}>
                        <Statistic title="Account Balance" value={this.props.user ? this.props.user.accountBalance : 0} precision={2} flex="center" prefix="SGD$" />
                    </Col>
                </Row>
                {/* <Row>
                    <Divider />
                </Row> */}
                {/* <Row gutter={16} justify="center">
                    <Col span={12}>
                        <Statistic title="Realized Profit" value={1000} precision={2} prefix="SGD$" />
                    </Col>
                </Row> */}
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        user: state.user.user
    }
}



export default connect(mapStateToProps)(Balance);