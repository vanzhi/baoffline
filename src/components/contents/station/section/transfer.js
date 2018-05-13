import React, { Component } from 'react';
import { Card, Row, Col, Select, Tree, Affix, Form, Button, Radio, Modal, Tag, message } from 'antd'
import { connect } from 'react-redux'
import * as Actions from '@/store/actions'
import * as API from '@/fetch/index'
import * as Business from '@/utils/business'
import Base from '@/config/base'
import Utils from '@/utils/utils'
import { clearImmediate } from 'core-js';
import utils from '../../../../utils/utils';

function mapStateToProps(state, ownProps) {
    return {
		currentStation: state.stations[state.currentStationId] || {},
		indexNode: state.nodes[state.indexNodeId] || {},
		nodes: state.nodes,
		stations: state.stations
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setLoadingOff: () => {
			dispatch(Actions.setLoadingOff())
		},
		refreshNodes: (stationId) => {
			dispatch(Actions.getNodes(stationId))
		}
    }
}

// 可编辑树
class EditTree extends Component {
	handleSelect = (selectedKeys) => {
		this.props.onSelect(selectedKeys[0] * 1)
	}
	getTreeNodes(pNodeId) {
		if (!pNodeId) return
		let node = this.props.nodes[pNodeId]
		return <Tree.TreeNode 
					title={ node.nodeName } 
					key={ pNodeId } 
					disabled={ pNodeId == this.props.indexNode.nodeId }>
					{ node.children && node.children.map(nodeId => this.getTreeNodes(nodeId)) }
				</Tree.TreeNode>
	}
	render() {
		let indexNode = this.props.indexNode
		let dfId = indexNode.nodeId ? indexNode.nodeId.toString() : ''
		return (
			dfId && <Tree
				onSelect={ this.handleSelect }
				defaultExpandedKeys={ [dfId] }>
				{ this.getTreeNodes(dfId) }
			</Tree> || <div className="cm-no-data">未选择站点</div>
		)
	}
}

// 当前站点树
class CurrentTree extends Component {
	handleSelect = (selectedKeys) => {
		this.props.onSelect(selectedKeys[0] * 1)
	}
	getTreeNodes(pNodeId) {
		if (!pNodeId) return
		let node = this.props.nodes[pNodeId]
		return <Tree.TreeNode 
					title={ node.nodeName } 
					key={ pNodeId }>
					{ node.children && node.children.map(nodeId => this.getTreeNodes(nodeId)) }
				</Tree.TreeNode>
	}
	render() {
		let indexNode = this.props.indexNode
		let dfId = indexNode.nodeId ? indexNode.nodeId.toString() : ''
		return (
			dfId ? <Tree 
				defaultExpandedKeys={ [dfId] }
				onSelect={ this.handleSelect }>
				{ this.getTreeNodes(indexNode.nodeId) }
			</Tree> : <div className="cm-no-data">未选择站点</div>
		)
	}
}

class Transfer extends Component {
	state = {
		transferType: 0,
		transferStationId: 0,
		transferIndexNode: {},
		transferNodes: {},
		selectTransferNodeId: 0,
		selectCurrentNodeId: 0,
		confirmVisible: false
	}
	transferType = {
		'1' : '转移内容',
		'2' : '转移栏目和内容'
	}

	handleClickTransfer = () => {
		switch(this.state.transferType) {
			case '1': 
				// todo
				message.warning('转移内容缺接口')
				break
			case '2':
				message.warning('接口调试中')
				// this.setState({ confirmVisible: true })
				break
		}
	}

	handleRadioChange = (e) => {
		this.setState({ transferType: e.target.value })
	}

	handleStationChange = (stationId) => {
		let param = { stationId }
		this.setState({ transferStationId : stationId })
		this.getTransferNodes(param)
	}

	handleTransferSelect = (nodeId) => {
		this.setState({ selectTransferNodeId: nodeId })
	}

	handleCurrentSelect = (nodeId) => {
		this.setState({ selectCurrentNodeId: nodeId })
	}

	handleOk = () => {
		let transferNode = this.state.transferNodes[this.state.selectTransferNodeId]
		let currentNode = this.props.nodes[this.state.selectCurrentNodeId]
		let param = {
			data: {
				"nodeId": this.state.selectTransferNodeId,
				"parentId": this.state.selectCurrentNodeId,
				"oldParentId": transferNode.parentId,
				"domainId": this.props.currentStation.id,
				"taxis": currentNode.children ? currentNode.children.length + 1 : 1
			}
		}
		this.submitTransfer(param)
	}

	handleCancel = () => {
		this.setState({ confirmVisible: false })
	}

	refreshNodes() {
		let param = { stationId: this.state.transferStationId }
		this.setState({ selectTransferNodeId: 0 })
		this.getTransferNodes(param)
		this.props.refreshNodes()
	}

	submitTransfer(param) {
		API.sortNode(param)
			.then(success => {
				this.refreshNodes()
				this.setState({ confirmVisible: false })
				message.success('转移成功')
			})
			.catch(error => {
				this.setState({ confirmVisible: false })
				message.warning('转移失败')
			})
	}

	getTransferNodes(param) {
		API.getNodeList(param)
			.then(success => {
				let transferNodes = Business.setNodes(success.data)
				let transferIndexNode = transferNodes[success.data[0].nodeId]
				this.setState({
					transferNodes,
					transferIndexNode
				})
			})
			.catch(error => {

			})
	}

	setComfirmModal() {
		let transferStation = this.props.stations[this.state.transferStationId]
		let transferNode = this.state.transferNodes[this.state.selectTransferNodeId]
		let currentNode = this.props.nodes[this.state.selectCurrentNodeId]
		let currentStation = this.props.currentStation
		return (
			<Modal
				visible={ this.state.confirmVisible }
				title="确认"
				onOk={ this.handleOk }
				onCancel={ this.handleCancel }
				okText="转移"
				cancelText="取消">
				<div>
					将站点<span style={{color: '#87d068'}}>{ transferStation.domainName }</span>下的
					<Tag color="green" style={{marginLeft: '5px'}}>{transferNode.nodeName}</Tag>栏目及其子栏目与内容，转移到站点<span style={{color: '#108ee9'}}>{ currentStation.domainName }</span>下的
					<Tag color="blue" style={{marginLeft: '5px'}}>{currentNode.nodeName}</Tag>栏目？
				</div>
			</Modal>
		)
	}

	setTransferStation() {
		return (
			<Row type="flex" align="middle" justify="center">
				<Col span={2}>从：</Col>
				<Col span={22}>
					<Select
						placeholder="请选择站点"
						onChange={ this.handleStationChange }
						style={{ width: '100%' }}>
						{
							Utils.each(this.props.stations, (item, key) => {
								return (
									<Select.Option 
										disabled={ this.props.currentStation.id === item.id }
										key={ item.id }
										value={ item.id * 1 }>{ item.domainName }</Select.Option>
								)
							})
						}
					</Select>
				</Col>
			</Row>
		)
	}
	setCurrentStationName () {
		return (
			<Row style={{ lineHeight:'32px' }}>
				<Col span={4}>转移到：</Col>
				<Col span={20} style={{ color: '#1890ff' }}>{ this.props.currentStation.domainName }</Col>
			</Row>
		)
	}
	setCurrentNodes() {
		return (
			<Card
				type="inner"
				title={ this.setCurrentStationName() }>
				<CurrentTree
					onSelect={ this.handleCurrentSelect }
					indexNode={ this.props.indexNode }
					nodes={ this.props.nodes }/>
			</Card>
		)
	}
	setTransferNodes() {
		return (
			<Card
				type="inner"
				title={ this.setTransferStation() }>
				<EditTree
					onSelect={ this.handleTransferSelect }
					indexNode={ this.state.transferIndexNode }
					nodes={ this.state.transferNodes } />
			</Card>
		)
	}
	render() {
		return (
			<div className="cm-content">
				<div style={{ marginBottom: '20px' }}>
					<Radio.Group onChange={ this.handleRadioChange }>
						{
							Utils.each(this.transferType, (item, key) => {
								return <Radio value={ key } key={ key }>{ item }</Radio>
							})
						}
					</Radio.Group>
					<Button 
						onClick={ this.handleClickTransfer }
						type="primary" 
						disabled={ !this.state.transferType || !this.state.selectTransferNodeId || !this.state.selectCurrentNodeId }>
						转移
					</Button>
				</div>
				<Row gutter={20}>
					<Col span={12}>
						{ this.setTransferNodes() }
					</Col>
					<Col span={12}>
						{ this.setCurrentNodes() }
					</Col>
				</Row>
				{ this.state.confirmVisible && this.setComfirmModal() }
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Transfer)