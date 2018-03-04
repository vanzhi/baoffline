import React, { Component } from 'react';
import { Layout, Input, Button, Tree, message, Modal, Form, Select, Icon, Upload, Radio, Switch, Checkbox } from 'antd'
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
	formItemLayout = {
		labelCol: {
			span: 4
		},
		wrapperCol: {
			span: 8
		}
	}
	formItemLayoutOther = {
		...this.formItemLayout,
		wrapperCol: {
			span: 16
		}
	}
	contentTypeChangeHandler = (value, e) => {
		this.setState({ contentModelId: value })
		return value
	}
	uploadChangeHandler = (info) => {
		// console.log(info)
	}
	uploadImageRequest = (info) => {
		// console.log(info)
		// API.uploadImage({ stationId : this.props.stationId, img1 : info.file })
	}
	render() {
		const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form
		const isPNode = this.props.pNode ? true : false
		let node = this.props.pNode || this.props.cNode || {}

		return (
			<Form>
				<Form.Item { ...this.formItemLayout } label={ isPNode ? '父栏目' : '当前栏目' }>
					<span>{ node.nodeName }</span>
				</Form.Item>
				<Form.Item { ...this.formItemLayout } label="栏目名称" >
					{	
						// nodeName和原生对象属性冲突
						getFieldDecorator('nodeName_', {
							rules: [{ required: true, message: '请填写栏目名称' }],
						})(
							<Input />
						)
					}
				</Form.Item>
				<Form.Item { ...this.formItemLayout } label="栏目索引" help="唯一，小写英文字母">
					{	
						getFieldDecorator('nodeIndexName', {
							rules: [{ required: true, message: '请填写栏目索引名称' }],
						})(
							<Input />
						)
					}
				</Form.Item>
				<Form.Item { ...this.formItemLayout } label="栏目类型">
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
				<Form.Item { ...this.formItemLayout } label="外部链接">
					{	
						getFieldDecorator('linkUrl')(
							<Input />
						)
					}
				</Form.Item>
				<Form.Item { ...this.formItemLayout } label="连接类型">
					{	
						getFieldDecorator('linkType')(
							<Input />
						)
					}
				</Form.Item>
				<Form.Item { ...this.formItemLayout } label="栏目图片">
					<div className="cm-dropbox">
						{
							getFieldDecorator('dragger', {
								valuePropName: 'fileList',
							})(
								<Upload.Dragger 
									name="img1"
									action={ API._uploadImage({ stationId : this.props.stationId }) } 
									onChange={ this.uploadChangeHandler }>
									<p className="ant-upload-drag-icon">
										<Icon type="inbox" />
									</p>
									<p className="ant-upload-text">点击此处或拖拽文件上传</p>
								</Upload.Dragger>
							)
						}
					</div>
				</Form.Item>
				<Form.Item { ...this.formItemLayoutOther } label="栏目内容">
					todo
				</Form.Item>
				<Form.Item { ...this.formItemLayoutOther } label="栏目摘要">
					{
						getFieldDecorator('description')(
							<Input.TextArea />
						)
					}
				</Form.Item>
				<Form.Item { ...this.formItemLayoutOther } label="栏目组">
					{
						getFieldDecorator('todo0')(
							<Checkbox.Group />
						)
					}
				</Form.Item>
				<Form.Item { ...this.formItemLayoutOther } label="专题">
					{
						getFieldDecorator('todo1')(
							<Switch defaultChecked={false} />
						)
					}
				</Form.Item>
				<Form.Item { ...this.formItemLayoutOther } label="是否隐藏">
					{
						getFieldDecorator('todo2')(
							<Switch defaultChecked={false} />
						)
					}
				</Form.Item>
					{ 
						!isPNode 
						&& (<div className="fn-text-center">
								<Button type="primary">提交</Button>
							</div>)
						|| ''
					}
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
		let nodeId = selectedKeys[0] * 1
		this.setState({ selectedKey: nodeId })
		
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
	// 选择节点的界面
	setToSelect() {
		return (
			<div className="cm-no-data">请选择一个节点</div>
		)
	}
	// 编辑界面
	setEdit() {
		let nodeId = this.state.selectedKey
		let EditFrom = Form.create({
			mapPropsToFields(props) {
				let node = props.cNode
				return {
					nodeName_ : Form.createFormField({
						value: node.nodeName,
					}),
					// todo
				}
			}
		})(ContentForm)

		return <EditFrom 
				cNode={ this.props.nodes[this.state.selectedKey] } 
				stationId={ this.props.currentStationId } />
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
	// 设置添加弹窗
	setAddModal() {
		let AddFrom = Form.create()(ContentForm)
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
						stationId={ this.props.currentStationId } />
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
					{ this.state.selectedKey > 0  ? this.setEdit() : this.setToSelect() }
				</Layout.Content>
				{ this.setDeleteModal() }
				{ this.setAddModal() }
			</Layout>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)