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
import './SideMenu.css';
import Dashboard from '../Dashboard/Dashboard';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class SideMenu extends Component {
    state = {
        collapsed: false,
    };

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };

    render() {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                    <div className="side-menu"></div>
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                        <Menu.Item key="1" icon={<HomeOutlined />}>
                            Dashboard
                         </Menu.Item>
                        <Menu.Item key="2" icon={<LineChartOutlined />}>
                            Trade
                        </Menu.Item>
                        <Menu.Item key="3" icon={<HistoryOutlined />}>
                            Trade History
                        </Menu.Item>
                        <SubMenu key="sub1" icon={<UserOutlined />} title="Profile">
                            <Menu.Item key="4">Change Password</Menu.Item>
                        </SubMenu>
                        <Menu.Item key="5" icon={<LogoutOutlined />}>
                            Logout
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ padding: 0 }}>
                        {/* <Image src="./Images/logo.png" className="logo" /> */}
                    </Header>
                    <Content style={{ margin: '0 16px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
                            {/* <Breadcrumb.Item>Bill</Breadcrumb.Item> */}
                        </Breadcrumb>
                        <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
                            <Dashboard></Dashboard>
                        </div>
                    </Content>
                    {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
                </Layout>
            </Layout>
        );
    }
}

export default SideMenu;