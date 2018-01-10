import React, { Component } from 'react';
import { Layout, Icon, Menu } from 'antd';
import Logo from '@/assets/logo.png';
import { Link } from 'react-router-dom';
import Base from '@/config/base';

const MenuInfo  = Base.MenuInfo;
const SubMenu   = Menu.SubMenu;

// 获取顶部菜单
const TopMenu = () => {
    let doms = [];
    for (let i = 0; i < MenuInfo.menus.length; i++) {
        let menu = MenuInfo.menus[i];
        switch(menu.key) {
            case 'station':
                doms.push(
                    <SubMenu title={<span>{menu.icon()}选择站点</span>} key={menu.key}>
                        <Menu.Item key="xxxx">xxxxx站点</Menu.Item>
                    </SubMenu>
                );
                break;
            default:
                doms.push(
                    <Menu.Item key={menu.key}>
                        {menu.icon()}{menu.name}
                    </Menu.Item>
                )
        }
    }
    return doms;
}

// top
class Top extends Component {
    state = {
        current : 'mail'
    }
    handleClick = (e) => {
        console.log('click ', e);
        this.setState({
            current: e.key,
        });
    }
    render () {
        return (
            <Layout>
                <div className="layout-top">
                    <img src={Logo} width="120" />
                    <a className="top-menu-fold"><Icon type="menu-fold" /></a>
                    <div className="fn-m-l-40">
                        <Menu
                            onClick     ={this.handleClick}
                            selectedKeys={[this.state.current]}
                            mode        ="horizontal"
                            className   ="no-border">
                            {TopMenu()}
                        </Menu>
                    </div>
                    <a className="top-right">
                        <div className="cm-circle">
                            <Icon type="home" />
                        </div>
                        <div className="cm-circle fn-m-r-10">
                            <Icon type="logout" />
                        </div>
                        {/* 西瓜头 */}
                    </a>
                </div>
            </Layout>
        );
    }
}

export default Top;