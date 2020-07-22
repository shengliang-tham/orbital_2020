import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import {
    LineChartOutlined,
    HomeOutlined,
    UserOutlined,
    HistoryOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import { Image } from "react-bootstrap";
import './SideMenu.scss';
import Dashboard from '../Dashboard/Dashboard';
import Trade from '../Trade/Trade';
import { withRouter, } from "react-router";
import Profile from '../Profile/Profile';
import indomieHome from '../../../assets/Images/indomie-home.png'
import { connect } from 'react-redux'
import * as actionTypes from '../../../store/actions/authActions';
import Backtest from '../Backtest/Backtest';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class SideMenu extends Component {
    state = {
        collapsed: false,
        defaultKey: 1
    };

    onCollapse = collapsed => {
        this.setState({ collapsed });
    };

    onClickMenu = id => {
        this.setState({
            ...this.state, defaultKey: id
        })
    }

    onClickSignout = () => {
        this.props.history.push('/');
        localStorage.clear();
        this.props.deleteToken();
    }
    render() {

        let components = (<Dashboard></Dashboard>);
        if (this.state.defaultKey == 2) {
            components = (<Trade></Trade>)
        } else if (this.state.defaultKey == 3) {
            components = (<Backtest></Backtest>)
        }
        else if (this.state.defaultKey == 4) {
            components = (<Profile></Profile>)
        }

        return (
            <div className="SideMenu">
                <Layout style={{ minHeight: '100vh' }}>
                    <Sider breakpoint="lg" collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                        <Header className="site-layout-background" style={{ padding: 0 }}>
                            {!this.state.collapsed ? <Image src={indomieHome} className="logo" /> : <div className="logo"></div>}

                        </Header>
                        <Menu theme="Light" defaultSelectedKeys={['1']} mode="inline">
                            <Menu.Item key="1" icon={<HomeOutlined />} onClick={() => this.onClickMenu("1")}>
                                Dashboard
                              </Menu.Item>
                            <Menu.Item key="2" icon={<LineChartOutlined />} onClick={() => this.onClickMenu("2")}>
                                Trade
                                </Menu.Item>
                            <Menu.Item key="3" icon={<HistoryOutlined />} onClick={() => this.onClickMenu("3")}>
                                Back Test
                              </Menu.Item>
                            <Menu.Item key="4" icon={<UserOutlined />} onClick={() => this.onClickMenu("4")}>
                                Profile

                            </Menu.Item>
                            <Menu.Item key="5" icon={<LogoutOutlined />} onClick={() => this.onClickSignout()}>
                                Logout
                        </Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout className="site-layout">
                        <Content style={{ margin: '0 16px' }}>
                            <Breadcrumb style={{ margin: '16px 0' }}>
                                <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
                            </Breadcrumb>
                            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                                {components}
                            </div>
                        </Content>
                    </Layout>
                </Layout>
            </div>
        );
    }
}


const mapDispatchToProps = dispatch => {
    return {
        deleteToken: () => { dispatch({ type: actionTypes.DELETE_TOKEN }) }
    }
}

export default connect(null, mapDispatchToProps)(withRouter(SideMenu));