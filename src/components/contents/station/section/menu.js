import React, { Component } from 'react';
import { Layout, Input, Button, Tree, message, Modal, Form, Select, Icon, Upload, Switch, Checkbox, Divider } from 'antd'
import E from 'wangeditor'
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

// 富文本编辑器
class Editor extends React.Component {
	state = {
		initContent: this.props.value,
		editorContent: this.props.value
	}
	static defaultProps = {
		onChange: () => {}
	}
	render() {
		return (
			<div ref="myeditor" dangerouslySetInnerHTML={{
				__html: this.state.initContent
			}}></div>
		)
	}
	componentDidMount() {
		let editor = new E(this.refs.myeditor)
		editor.customConfig.onchange = html => {
			this.setState({
				editorContent: html
			})
			this.props.onChange(html)
		}
		editor.create()
	}
}

// 图片上传
class PictureUpload extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			previewVisible: false,
			previewImage: '',
			fileList: props.value ? [{
				name: 'imageUrl',
				url: props.value,
				uid: 'imageUrl',
				status: 'done'
			}] : []
		}
	}

	static defaultProps = {
		onChange: () => {}
	}

	handleCancel = () => this.setState({ previewVisible: false })

	handlePreview = (file) => {
		this.setState({
			previewImage: file.url || file.thumbUrl,
			previewVisible: true,
		})
	}

	handleRemove = (data) => {
		this.setState({ fileList: [] })
		this.props.onChange()
	}

	handleChange = (data) => {
		let file = data.fileList[0]
		this.setState({
			fileList: data.fileList
		})
		if (file.status === 'done' && file.response && file.response.code === 1000) (
			this.props.onChange(file.response.data[0].url)
		)
	}

	render() {
		const { previewVisible, previewImage, fileList } = this.state;
		return (
			<div className="clearfix">
				<Upload
					action={ API._uploadImage({ stationId: this.props.stationId }) }
					accept="image/*"
					listType="picture-card"
					defaultFileList={ this.props.fileList }
					fileList={ fileList }
					name={ `img${fileList.length}` }
					onPreview={ this.handlePreview }
					onRemove={ this.handleRemove }
					onChange={ this.handleChange }
					multiple>
					{
						!this.state.fileList.length && (<div>
							<Icon type="plus" />
							<div className="ant-upload-text">图片上传</div>
						</div>)
					}
				</Upload>
				<Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
					<img alt="example" style={{ width: '100%' }} src={previewImage} />
				</Modal>
			</div>
		)
	}
}


// 添加/编辑表单
class MenuForm extends Component {
	state = {
		
	}
	formItemLayout = {
		labelCol: {
			span: 4
		},
		wrapperCol: {
			span: 8
		}
	}
	editItemLayout = {
		labelCol: {
			span: 4
		},
		wrapperCol: {
			span: 20
		}
	}
	formItemLayoutOther = {
		...this.formItemLayout,
		wrapperCol: {
			span: 16
		}
	}
	uploadChangeHandler = (info) => {
		// console.log(info)
	}
	uploadImageRequest = (info) => {
		// console.log(info)
		// API.uploadImage({ stationId : this.props.stationId, img1 : info.file })
	}
	render() {
		const { getFieldDecorator } = this.props.form
		const isPNode = this.props.pNode ? true : false
		let node = this.props.pNode || this.props.cNode || {}
		let cNode = this.props.cNode || {}

		return (
			<Form>
				<Form.Item { ...this.formItemLayout } label={ isPNode ? '父栏目' : '当前栏目' }>
					<span>{ node.nodeName }</span>
				</Form.Item>
				<Form.Item { ...this.formItemLayout } label="栏目名称" >
					{	
						// nodeName和原生对象属性冲突
						getFieldDecorator('nodeName_', {
							initialValue: cNode.nodeName,
							rules: [{ required: true, message: '请填写栏目名称' }],
						})(
							<Input />
						)
					}
				</Form.Item>
				<Form.Item { ...this.formItemLayout } label="栏目索引" help="唯一，小写英文字母">
					{	
						getFieldDecorator('nodeIndexName', {
							initialValue: cNode.nodeIndexName,
							rules: [{ required: true, message: '请填写栏目索引名称' }],
						})(
							<Input />
						)
					}
				</Form.Item>
				<Form.Item { ...this.formItemLayout } label="栏目模型">
					{	
						getFieldDecorator('contentModelId', {
							initialValue: cNode.contentModelId,
							rules: [{ required: true, message: '请选择栏目模型' }],
						})(
							<Select>
								{ Utils.each(Base.contentMode, (name, key) => {
									return <Select.Option key={ key } value={ key }>{ name }</Select.Option>
								}) }
							</Select>
						)
					}
				</Form.Item>
				<Form.Item { ...this.formItemLayout } label="栏目链接">
					{	
						getFieldDecorator('linkUrl', {
							initialValue: cNode.linkUrl,
						})(
							<Input />
						)
					}
				</Form.Item>
				<Form.Item { ...this.formItemLayout } label="链接类型">
					{	
						getFieldDecorator('linkType', {
							initialValue: cNode.linkType,
							rules: [{ required: true, message: '请选择栏目链接' }],
						})(
							<Select>
								{ Utils.each(Base.linkType, (name, key) => {
									return <Select.Option key={ key } value={ key }>{ name }</Select.Option>
								}) }
							</Select>
						)
					}
				</Form.Item>
				<Form.Item { ...this.formItemLayout } label="栏目图片">
					<div>
						{
							getFieldDecorator('imageUrl', {
								initialValue: cNode.imageUrl,
							})(
								<PictureUpload stationId={ this.props.stationId } />
							)
						}
					</div>
				</Form.Item>
				<Form.Item { ...this.editItemLayout } label="栏目内容" style={{zIndex:1}}>
					{
						getFieldDecorator('content', {
							initialValue: cNode.content,
						})(
							<Editor />
						)
					}
				</Form.Item>
				<Form.Item { ...this.formItemLayoutOther } label="栏目摘要">
					{
						getFieldDecorator('description', {
							initialValue: cNode.description,
						})(
							<Input.TextArea />
						)
					}
				</Form.Item>
				<Form.Item { ...this.formItemLayoutOther } label="栏目类型">
					{
						getFieldDecorator('nodeType', {
							initialValue: cNode.nodeType,
						})(
							<Select>
								{ Utils.each(Base.nodeType, (name, key) => {
									return <Select.Option key={ key } value={ key }>{ name }</Select.Option>
								}) }
							</Select>
						)
					}
				</Form.Item>
				<Form.Item { ...this.formItemLayoutOther } label="栏目组">
					todo - 缺栏目组按name查询接口
				</Form.Item>
				<Form.Item { ...this.formItemLayoutOther } label="是否隐藏">
					{
						getFieldDecorator('isShow', {
							valuePropName: 'defaultChecked',
							initialValue: cNode.isShow === 1,
							getValueFromEvent: (value) => {
								return value
							}
						})(
							<Switch />
						)
					}
				</Form.Item>
				<Form.Item { ...this.formItemLayoutOther } label="权限">
					todo缺字段
				</Form.Item>
			</Form>
		)
	}
}

// 侧边组织树
class LeftTree extends Component {
	state = {
		checkedKeys: [],
		selectedKey: 0,
		addVisible: false,
		deleteVisible: false
	}
	handleAdd = () => {
		this.setState({ addVisible: true })
	}
	handleCut = () => {
		this.setState({ deleteVisible : true })
	}
	handleCheck = (checkedObj, e) => {
		this.setState({ checkedKeys: checkedObj.checked })
	}
	handleSelect = (selectedKeys, e) => {
		let nodeId = selectedKeys[0] * 1
		this.setState({ selectedKey: nodeId })
		this.props.onSelectChange(nodeId)
	}
	handleDrop = (info) => {
		const fromKey = info.dragNode.props.eventKey * 1
		const toKey = info.node.props.eventKey * 1
		const pos = info.node.props.pos.split('-').map(p => Number(p))
		const posType = info.dropPosition - pos[pos.length - 1]
		const parentId = this.props.nodes[fromKey].parentId
		const pNode = this.props.nodes[parentId]
		let sort = pos[pos.length - 1]
		let param = {
			data: {
				nodeId: fromKey,
				parentId: parentId,
				oldParentId: parentId,
				domainId: this.props.currentStationId,
				taxis: pNode.children.indexOf(fromKey) + 1
			}
		}
		
		// 错误的位移
		if (this.checkNodeInAnother(toKey, fromKey)) {
			message.warning('不能移动到当前节点的子节点')
			return
		}

		// 不变
		if (info.dragNode.props.pos === (info.node.props.pos.substring(0, info.node.props.pos.length - 1) + info.dropPosition)) {
			return
		}

		if ([-1, 1].indexOf(posType) > -1 && this.props.indexNode.nodeId === toKey) {
			message.warning('不可设置到根目录')
			return 
		}

		if (this.props.nodes[toKey].parentId === parentId && sort > pNode.children.indexOf(fromKey)) {
			sort = sort - 1
		}
		
		console.log(info.dragNode.props.pos, info.dropPosition, info.node.props.pos)
		switch(posType) {
			// 上
			case -1:
				param.data.parentId = this.props.nodes[toKey].parentId
				param.data.taxis = sort + 1
				break
			// 里
			case 0:
				param.data.parentId = toKey
				param.data.taxis = this.props.nodes[toKey].children ? this.props.nodes[toKey].children.length + 1 : 1
				break
			// 下
			case 1:
				param.data.parentId = this.props.nodes[toKey].parentId
				param.data.taxis = sort + 2
				break
			default:
		}
		
		API.sortNode(param)
			.then(success => {
				this.refreshNodes()
			})
			.catch(error => {
				message.warning('修改节点排序失败')
			})
	}
	handleAddOk = () => {
		this.refs.addForm.validateFieldsAndScroll((err, values) => {
			if (!err) {
				values.nodeName = values.nodeName_
				delete values.nodeName_
				let param = {
					stationId: this.props.currentStationId,
					data: { 
						...values, 
						parentId: this.state.selectedKey 
					}
				}
				this.submitAdd(param)
			}
		})
	}
	handleAddCancel = () => {
		this.setState({ addVisible: false })
	}
	submitAdd(param) {
		API.addNode(param)
			.then(success => {
				message.success('添加成功。')
				this.refreshNodes()
				this.setState({ addVisible: false })
			})
			.catch(error => {

			})
	}
	deleteOk = () => {
		let hide = message.loading('正在删除')
		let param = {
			data: {
				ids : this.state.checkedKeys.map(nodeId => Number(nodeId))
			}
		}
		this.setState({ deleteVisible : false })
		API.deleteNodes(param)
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
	addCancel = () => {
		this.setState({ addVisible : false })
	}
	refreshNodes() {
		this.props.onNodeChange()
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
					disabled={ pNodeId === this.props.indexNode.nodeId }
					disableCheckbox={ pNodeId === this.props.indexNode.nodeId }>
					{ node.children && node.children.map(nodeId => this.getTreeNodes(nodeId)) }
				</TreeNode>
	}
	// 设置添加弹窗
	setAddModal() {
		let AddForm = Form.create()(MenuForm)
		return (
			<Modal
				title="添加栏目"
				okText="添加"
				cancelText="取消"
				width={ 1080 }
				visible={ this.state.addVisible }
				onOk={ this.handleAddOk }
				onCancel={ this.handleAddCancel } >
				{ 
					this.state.selectedKey > 0 
					&& <AddForm 
						ref="addForm" 
						pNode={ this.props.nodes[this.state.selectedKey]}
						stationId={ this.props.currentStationId } />
				}
			</Modal>
		)
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
	render() {
		let indexNode = this.props.indexNode
		let dfId = indexNode.nodeId ? indexNode.nodeId.toString() : ''
		return (
			<Layout.Sider className="fn-bg-grey station-tree-layout">
				<div className="station-tree edit fn-bg-grey">
					<Button type="primary" icon="plus" ghost disabled={ !this.state.selectedKey } onClick={ this.handleAdd }/>
					<Button type="danger" icon="minus" ghost disabled={ !this.state.checkedKeys.length } onClick={ this.handleCut }/>
					{
						dfId && (
							<Tree 
								checkable
								draggable
								checkStrictly={ true }
								defaultExpandedKeys={ [dfId] }
								onCheck={ this.handleCheck }
								onSelect={ this.handleSelect }
								onDrop={ this.handleDrop } >
								{ this.getTreeNodes(indexNode.nodeId) }
							</Tree>
						)
					}
					{ this.setAddModal() }
					{ this.setDeleteModal() }
				</div>
			</Layout.Sider>
		)
	}
}

// 主页面
class Menu extends Component {
	state = {
		selectedKey : null,
		addVisible: false
	}
	handleSelectChange = (selectedKey) => {
		this.setState({ selectedKey })
	}
	handleNodeChange = () => {
		this.props.refreshNodes(this.props.currentStationId)
	}
	handleEditOk = () => {
		this.refs.editForm.validateFieldsAndScroll((err, values) => {
			if (!err) {
				let param = { ...values }
				param.nodeId = this.state.selectedKey
				param.nodeName = param.nodeName_
				param.isShow = values.isShow ? 1 : 0
				delete param.nodeName_
				this.submitEdit(param)
			}
		})
	}
	handleEditCancel = () => {
		this.refs.editForm.resetFields()
	}
	submitEdit(param) {
		API.updateNode({ data : param })
			.then(success => {
				message.success('修改成功')
				this.props.refreshNodes(this.props.currentStationId)
			})
			.catch(error => {

			})
	}
	// 选择节点的界面
	setToSelect() {
		return (
			<div className="cm-no-data">请选择一个节点</div>
		)
	}
	// 编辑界面
	setEdit() {
		// let nodeId = this.state.selectedKey
		let EditForm = Form.create()(MenuForm)

		return (
			<div>
				<EditForm 
					ref="editForm"
					cNode={ this.props.nodes[this.state.selectedKey] } 
					stationId={ this.props.currentStationId } />
				<Divider />
				<div className="fn-text-center">
					<Button 
						onClick={ this.handleEditOk } 
						size="large" 
						type="primary">提交</Button>
					<Button 
						onClick={ this.handleEditCancel } 
						size="large" 
						type="defautl">重置</Button>
				</div>
			</div>
		)
	}
	render() {
		return (
			<Layout>
				<LeftTree 
					ref="leftTree"
					indexNode={ this.props.indexNode } 
					nodes={ this.props.nodes }
					currentStationId={ this.props.currentStationId }
					onNodeChange={ this.handleNodeChange }
					onSelectChange={ this.handleSelectChange }>
				</LeftTree>
				<Layout.Content className="fn-bg-white cm-content">
					{ this.state.selectedKey > 0  ? this.setEdit() : this.setToSelect() }
				</Layout.Content>
			</Layout>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)