import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Layout, Icon, Menu } from 'antd';
import { NavLink, Link } from 'react-router-dom';
import * as Actions from '@/store/actions';
import Logo from '@/assets/logo.png';
import Base from '@/config/base';

// todo - 获取到有权限的站点后设置默认跳转
function mapStateToProps(state) {
    let stationList = [];
    for (let key in state.stations) {
        stationList.push(state.stations[key]);
    }
    // 映射到props
    return {
        path : state.path,
        menus : Base.MenuInfo.menus,
        currentStation: state.stations[state.currentStation] || {},
        stationList
    }
}

function mapDispatchToProps(dispatch) {
    // ui组件发送action
    return {
        setCurrentStation : (station) => {
            dispatch(Actions.setCurrentStation(station.id))
        }
    }
}

// top
class Top extends Component {
    // 设置顶部菜单
    setStation() {
        let { stationList } = this.props;
        return stationList.map(item => {
            return (
                <Menu.Item key={item.id}>
                    <NavLink 
                        to={{
                            pathname:'/station'
                        }}
                        onClick={_ => this.props.setCurrentStation(item)}>
                        {item.domainName}
                    </NavLink>
                </Menu.Item>
            )
        })
    }

    setTopMenu() {
        let { menus, currentStation } = this.props;
        return menus.map(menu => {
            let { key, icon, name } = menu;
            let { domainName } = currentStation;
            switch(menu.key) {
                case 'station':
                    return (
                        <Menu.SubMenu title={<span>{icon}{domainName || '选择站点'}</span>} key={key}>
                            {this.setStation()}
                        </Menu.SubMenu>
                    );
                default:
                    return (
                        <Menu.Item key={key}>
                            <NavLink to={`/${key}`}>
                                {icon}{name}
                            </NavLink>
                        </Menu.Item>
                    )
            }
        })
    }
    render () {
        return (
            <Layout>
                <div className="layout-top">
                    <img src={Logo} width="120" alt="" />
                    <div className="fn-m-l-40">
                        <Menu
                            selectedKeys={this.props.path}
                            mode        ="horizontal"
                            className   ="no-border">
                            {this.setTopMenu()}
                        </Menu>
                    </div>
                    <span className="top-right">
                        <Link to="/" className="cm-circle">
                            <Icon type="home" />
                        </Link>
                        <a className="cm-circle fn-m-r-10">
                            <Icon type="logout" />
                        </a>
                        {/* 西瓜头 */}
                    </span>
                </div>
            </Layout>
        );
    }
}

// 触发ui重新渲染
export default connect(mapStateToProps, mapDispatchToProps)(Top)