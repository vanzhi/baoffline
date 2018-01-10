import React, { Component } from 'react';
import { Layout } from 'antd';
import Top from '@/components/layouts/top';
import Left from '@/components/layouts/left';
import Middle from '@/components/layouts/middle';
import Bottom from '@/components/layouts/bottom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './styles/reset.scss';
import './styles/layout.scss';
import './styles/common.scss';
import './styles/fn.scss';
import './styles/custom.scss';

class App extends Component {
    render() {
        return (
            <Router>
                <Layout>
                    <Top></Top>
                    <Layout className="layout-middle fn-bg-white">
                        <Left></Left>
                        <Middle></Middle>
                    </Layout>
                    <Bottom></Bottom>
                </Layout>
            </Router>
        );
    }
}

export default App;
