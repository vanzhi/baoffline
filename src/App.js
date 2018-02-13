import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { Layout } from 'antd';
import Top from '@/components/layouts/top';
import Left from '@/components/layouts/left';
import Middle from '@/components/layouts/middle';
import Bottom from '@/components/layouts/bottom';
import * as Actions from '@/store/actions';
import './styles/reset.scss';
import './styles/layout.scss';
import './styles/common.scss';
import './styles/fn.scss';
import './styles/custom.scss';

function mapStateToProps(state) {
    // 暂时在这里传入menus
    return {
        menus : state.menus
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setPath : (location, menus) => {
            // 存储路由路径到store
            dispatch(Actions.setPath(location, menus));
        }
    }
}

class Root extends Component {
    componentWillMount() {
        this.props.setPath(this.props.location, this.props.menus);
    }
    componentWillUpdate(nextProps) {
        this.props.setPath(nextProps.location, this.props.menus);
    }
    render() {
        return (
            <Layout>
                <Top></Top>
                <Layout className="layout-middle fn-bg-white">
                    <Left></Left>
                    <Middle></Middle>
                </Layout>
                <Bottom></Bottom>
            </Layout>
        )
    }
}

class App extends Component {
    render() {
        return (
            <Router>
                <Route path="/" component={ connect(mapStateToProps, mapDispatchToProps)(Root)}></Route>
            </Router>
        );
    }
}

export default App
