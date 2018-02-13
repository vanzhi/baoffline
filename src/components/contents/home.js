import React, { Component } from 'react'
import { Card, Col, Row } from 'antd'

class Home extends Component {
	constructor(props) {
	  super(props);
	
	  this.state = {};
	}

	render() {
		return (
			<div>
				<h1>系统信息</h1>
				<div>待审核内容：10篇</div>
				<div>上次登录时间：2017-1-12 00:02:02</div>
				<Row gutter={10}>
					<Col span={6}>
						<Card title="浏览量（PV）" bordered={true}>
							neirong
						</Card>
					</Col>
					<Col span={6}>
						<Card title="独立用户（UV）" bordered={true}>
							neirong
						</Card>
					</Col>
					<Col span={6}>
						<Card title="访问次数（VV）" bordered={true}>
							neirong
						</Card>
					</Col>
					<Col span={6}>
						<Card title="独立IP" bordered={true}>
							neirong
						</Card>
					</Col>
				</Row>
			</div>
		)
	}
}

export default Home