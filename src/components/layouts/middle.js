import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import Modules from '@/components/contents/index';
import ChooseStation from '@/components/contents/chooseStation';

function mapStateToProps(state, ownProps) {
    return {
        menus : state.menus,
        currentStation : state.currentStation,
        path: state.path
    }
}

function mapDispatchToProps(dispatch) {
    return {
        
    }
}

class Middle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            baseRoute : this.setBaseRouter()
        };
    }
    // 基础路由
    setBaseRouter() {
        let components = [];
        let { menus } = this.props;
        for (let key in menus) {
            let m = menus[key];
            let pathname = `/${m.path.join('/')}`;
            if (!m.children || !m.children.length) {
                // 叶子节点时
                let modulename = m.path.join('_');
                components.push(
                    <Route path={pathname} component={Modules[modulename]} key={pathname}></Route>
                )
            } else {
                // 非叶子节点时重定向到子节点的第一个叶子节点
                let childKey = m.children[0];
                while(menus[childKey].children) {
                    childKey = menus[childKey].children[0]
                }
                let modulePath = menus[childKey].path
                let modulePathname = `/${modulePath.join('/')}`
                components.push(
                    <Redirect from={pathname} exact to={modulePathname} key={pathname}></Redirect>
                )
            }
        }
        console.log(components)
        return components;
    }
    setRoutes() {
        let components = this.state.baseRoute;
        let { currentStation, path } = this.props;
        let isInStation = path[0] === 'station';
        // 在station栏目下且无stationid
        if (isInStation && !currentStation) {
            return (<Route path="/" component={ChooseStation}></Route>)
        }
        // 其他情况-默认
        return components;
    }
    render () {
        return (
            <Switch>
                {this.setRoutes()}
                <Route exact path="/test" component={Modules.test} key="test"></Route>
                <Route exact path="/" component={Modules.home} key="home"></Route>
            </Switch>
        );
    }
    component
}

export default connect(mapStateToProps, mapDispatchToProps)(Middle);