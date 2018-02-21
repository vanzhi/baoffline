import React, { Component } from 'react';
import { Layout, Input, Button, Tree, message, Modal, Form, Select } from 'antd'
import { connect } from 'react-redux'
import * as Actions from '@/store/actions'
import * as API from '@/fetch/index'
import Base from '@/config/base'
import Utils from '@/utils/utils'

const TreeNode = Tree.TreeNode

function mapStateToProps(state, ownProps) {
    return {
		currentStationId: state.currentStationId,
		indexNode: state.nodes[state.indexNodeId] || {},
        nodes: state.nodes
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

// 添加/编辑表单
class ContentForm extends Component {
	state = {
		contentModelId : Utils.firstKeyOf(Base.ContentType)
	}
	contentTypeChangeHandler = (value, e) => {
		this.setState({ contentModelId: value })
		return value
	}
	render() {
		const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form
		return (
			<Form>
				<Form.Item { ...this.props.formItemLayout } label="父节点">
					<span>{ this.props.pNode.nodeName }</span>
				</Form.Item>
				<Form.Item { ...this.props.formItemLayout } label="栏目名称" >
					{	
						// nodeName和原生对象属性冲突
						getFieldDecorator('nodeName_', {
							rules: [{ required: true, message: '请填写栏目名称' }],
						})(
							<Input />
						)
					}
				</Form.Item>
				<Form.Item { ...this.props.formItemLayout } label="栏目索引" help="唯一，小写英文字母">
					{	
						getFieldDecorator('nodeIndexName', {
							rules: [{ required: true, message: '请填写栏目索引名称' }],
						})(
							<Input />
						)
					}
				</Form.Item>
				<Form.Item { ...this.props.formItemLayout } label="栏目类型">
					{	
						getFieldDecorator('contentModelId', {
							initialValue: this.state.contentModelId,
							// getValueFromEvent: this.contentTypeChangeHandler
						})(
							<Select>
								{ Utils.each(Base.ContentType, (name, key) => {
									return <Select.Option key={ key } value={ key }>{ name }</Select.Option>
								}) }
							</Select>
						)
					}
				</Form.Item>
				<Form.Item { ...this.props.formItemLayout } label="外部链接">
					{	
						getFieldDecorator('linkUrl')(
							<Input />
						)
					}
				</Form.Item>
				<Form.Item { ...this.props.formItemLayout } label="连接类型">
					{	
						getFieldDecorator('linkType')(
							<Input />
						)
					}
				</Form.Item>
				{/* todo */}
				<Form.Item { ...this.props.formItemLayout } label="栏目图片">
					<div className="cm-dropbox">
						{
							getFieldDecorator('dragger', {
								valuePropName: 'fileList',
								getValueFromEvent: this.normFile,
							})(
								<Upload.Dragger name="files" action="/upload.do">
									<p className="ant-upload-drag-icon">
										<Icon type="inbox" />
									</p>
									<p className="ant-upload-text">Click or drag file to this area to upload</p>
									<p className="ant-upload-hint">Support for a single or bulk upload.</p>
								</Upload.Dragger>
							)
						}
					</div>
				</Form.Item>
			</Form>
		)
	}
}

// 主页面
class Menu extends Component {
	state = {
		checkedKeys: [],
		selectedKey: 0,
		deleteVisible: false,
		addVisible: false,
	}
	addHandler = () => {
		this.setState({ addVisible : true })
	}
	cutHandler = () => {
		this.setState({ deleteVisible : true })
	}
	checkHandler = (checkedObj, e) => {
		this.setState({ checkedKeys: checkedObj.checked })
	}
	selectHandler = (selectedKeys, e) => {
		this.setState({ selectedKey: selectedKeys[0] })
	}
	dropHandler = (info) => {
		const fromKey = info.dragNode.props.eventKey * 1
		const toKey = info.node.props.eventKey * 1
		const pos = info.node.props.pos.split('-').map(p => Number(p))
		const posType = info.dropPosition - pos[pos.length - 1]

		// 错误的位移
		if (this.checkNodeInAnother(toKey, fromKey)) {
			message.warning('不能移动到当前节点的子节点')
			return
		}

		// 不变
		if (info.dragNode.props.pos === (info.node.props.pos.substring(0, info.node.props.pos.length - 1) + info.dropPosition)) {
			return
		}
		
		// todo
		console.log(info.dragNode.props.pos, info.dropPosition ,info.node.props.pos)
		switch(posType) {
			// 上
			case -1:
				break
			// 里
			case 0:
				break
			// 下
			case 1:
				break
			default:
		}
	}
	deleteOk = () => {
		let hide = message.loading('正在删除')
		this.setState({ deleteVisible : false })
		API.deleteNodes({ codes : this.state.checkedKeys.map(nodeId => Number(nodeId)) })
			.then(success => {
				this.refreshNodes()
				message.success('删除成功')
				hide()
			})
			.catch(error => {

			})
	}
	deleteCancel = () => {
		this.setState({ deleteVisible : false })
	}
	addOk = () => {

	}
	addCancel = () => {
		this.setState({ addVisible : false })
	}
	refreshNodes() {
		this.props.refreshNodes(this.props.currentStationId)
	}
	checkNodeInAnother(nodeId, anotherNodeId) {
		let anotherNode = this.props.nodes[anotherNodeId]
		let isIn = anotherNode.children && anotherNode.children.indexOf(nodeId) > -1 ? true : false
		if (!isIn && anotherNode.children) {
			for (let i = 0; i < anotherNode.children.length; i++) {
				isIn = this.checkNodeInAnother(nodeId, anotherNode.children[i])
				if (isIn) break
			}
		}
		return isIn
	}
	getTreeNodes(pNodeId) {
		if (!pNodeId) return
		let node = this.props.nodes[pNodeId]
		return <TreeNode 
					title={ node.nodeName } 
					key={ pNodeId } 
					disableCheckbox={ pNodeId === this.props.indexNode.nodeId }>
					{ node.children && node.children.map(nodeId => this.getTreeNodes(nodeId)) }
				</TreeNode>
	}
	setEdit() {
		// todo
	}
	setDeleteModal() {
		return (
			<Modal
				title="确认"
				okText="确定"
				cancelText="取消"
				visible={ this.state.deleteVisible }
				onOk={ this.deleteOk }
				onCancel={ this.deleteCancel } >
				<p>确认删除选中节点？</p>
			</Modal>
		)
	}
	setAddModal() {
		let AddFrom = Form.create()(ContentForm)
		let formItemLayout = {
			labelCol: {
				span: 4
			},
			wrapperCol: {
				span: 8
			}
		}
		return (
			<Modal
				title="添加栏目"
				okText="添加"
				cancelText="取消"
				width={ 1080 }
				visible={ this.state.addVisible }
				onOk={ this.addOk }
				onCancel={ this.addCancel } >
				{ 
					this.state.selectedKey > 0 
					&& <AddFrom 
						pNode={ this.props.nodes[this.state.selectedKey]}
						formItemLayout={ formItemLayout } />
				}
			</Modal>
		)
	}
	render() {
		let indexNode = this.props.indexNode
		let dfId = indexNode.nodeId ? indexNode.nodeId.toString() : ''
		return (
			<Layout>
				<Layout.Sider className="fn-bg-grey station-tree-layout">
					<div className="station-tree edit fn-bg-grey">
						<Button type="primary" icon="plus" ghost disabled={ !this.state.selectedKey } onClick={ this.addHandler }/>
						<Button type="danger" icon="minus" ghost disabled={ !this.state.checkedKeys.length } onClick={ this.cutHandler }/>
						{
							dfId && (
								<Tree 
									checkable
									draggable
									checkStrictly={ true }
									defaultExpandedKeys={ [dfId] }
									onCheck={ this.checkHandler }
									onSelect={ this.selectHandler }
									onDrop={ this.dropHandler } >
									{ this.getTreeNodes(indexNode.nodeId) }
								</Tree>
							)
						}
					</div>
				</Layout.Sider>
				<Layout.Content className="fn-bg-white cm-content">
					{ this.setEdit() }
				</Layout.Content>
				{ this.setDeleteModal() }
				{ this.setAddModal() }
			</Layout>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)