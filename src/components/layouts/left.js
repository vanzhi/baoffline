import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import { Layout } from 'antd';

const station = () => {
    return (
        <div>123</div>
    )
}

class Left extends Component {
    render () {
        return (
            <Layout.Sider className="fn-bg-white">
                <Route path="/" component={station}></Route>
            </Layout.Sider>
        );
    }
}

export default Left;