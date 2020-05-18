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
import { withRouter, Redirect } from "react-router";
import Profile from '../Profile/Profile';
import indomieLogo from '../../../assets/Images/Indomie.jpg'

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class SideMenu extends Component {
    state = {
        collapsed: false,
        defaultKey: 1
    };

    onCollapse = collapsed => {
        console.log(collapsed);
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
    }
    render() {

        let components = (<Dashboard></Dashboard>);
        if (this.state.defaultKey == 2) {
            components = (<Trade></Trade>)
        } else if (this.state.defaultKey == 4) {
            components = (<Profile></Profile>)
        }

        return (
            <div className="SideMenu">
                <Layout style={{ minHeight: '100vh' }}>
                    <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                        <Header className="site-layout-background" style={{ padding: 0 }}>
                            <Image src={indomieLogo} className="logo" />

                        </Header>
                        <Menu theme="Light" defaultSelectedKeys={['1']} mode="inline">
                            <Menu.Item key="1" icon={<HomeOutlined />} onClick={() => this.onClickMenu("1")}>
                                Dashboard
                              </Menu.Item>
                            <Menu.Item key="2" icon={<LineChartOutlined />} onClick={() => this.onClickMenu("2")}>
                                Trade
                                </Menu.Item>
                            <Menu.Item key="3" icon={<HistoryOutlined />}>
                                Trade History
                              </Menu.Item>
                            {/* <SubMenu key="sub1" icon={<UserOutlined />} title="Profile">
                                <Menu.Item key="4">Change Password</Menu.Item>
                            </SubMenu> */}
                            <Menu.Item key="4" icon={<UserOutlined />} onClick={() => this.onClickMenu("4")}>
                                Profile

                            </Menu.Item>
                            <Menu.Item key="5" icon={<LogoutOutlined />} onClick={() => this.onClickSignout()}>
                                Logout
                        </Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout className="site-layout">
                        {/* <Header className="site-layout-background" style={{ padding: 0 }}>
                        {/* <Image src="./Images/logo.png" className="logo" /> 
                    </Header> */}
                        <Content style={{ margin: '0 16px' }}>
                            <Breadcrumb style={{ margin: '16px 0' }}>
                                <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
                                {/* <Breadcrumb.Item>Bill</Breadcrumb.Item> */}
                            </Breadcrumb>
                            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                                {components}
                            </div>
                        </Content>
                        {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
                    </Layout>
                </Layout>
            </div>
        );
    }
}

export default withRouter(SideMenu);