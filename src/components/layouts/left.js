import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { Layout, Menu } from 'antd';
import Base from '@/config/base';

function mapStateToProps(state, ownProps) {
    return {
        path : state.path
    }
}

function mapDispatchToProps(dispatch) {
    return {
        
    }
}

// 依据菜单进行组件
class Left extends Component {

    // menuList 菜单列表; preKeys 父级key列表
    setRoutes(menuList, preKeys = []) {
        if (!menuList) {
            return null;
        }
        return menuList.map((menu, i) => {
            let key  = menu.key;
            let children = menu.children;
            let subsDoms = this.setRoutes(children, [...preKeys, key]);

            switch(preKeys.length) {
                case 0:
                    // 设置路由模块
                    let basePath = `/${menu.key}`;
                    let component = () => (
                        <Layout.Sider className="fn-bg-white">
                            <Menu mode="inline" selectedKeys={this.props.path} defaultOpenKeys={this.props.path}>
                                {subsDoms}
                            </Menu>
                        </Layout.Sider>
                    );
                    return (
                        <Route path={basePath} component={component} key={menu.key}></Route>
                    );
                case 1:
                    // 设置二级菜单
                    let title = () => (
                        <span>{menu.icon}{menu.name}</span>
                    )
                    return (
                        <Menu.SubMenu title={title()} key={menu.key}>
                            {subsDoms}
                        </Menu.SubMenu>
                    )
                case 2:
                    // 设置三级菜单
                    let linkPath = ['', ...preKeys, menu.key].join('/');
                    return (
                        <Menu.Item key={menu.key}>
                            <Link to={{pathname: linkPath}}>{menu.name}</Link>
                        </Menu.Item>
                    );
                default:
                    return (<span></span>);
            }
        })
    }
    render () {
        return (
            <Switch>
                {this.setRoutes(Base.MenuInfo.menus)}
            </Switch>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Left);
