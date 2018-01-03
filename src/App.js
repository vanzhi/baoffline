import React, { Component } from 'react';
import { Layout } from 'antd';

const { Header, Footer, Sider, Content } = Layout;

class App extends Component {
    render() {
        return (
            <div>
                <Layout>
                    <Header>Header</Header>
                    <Layout>
                        <Sider>Sider</Sider>
                        <Content>Content</Content>
                    </Layout>
                    <Footer>Footer</Footer>
                </Layout>
            </div>
        );
    }
}

export default App;
