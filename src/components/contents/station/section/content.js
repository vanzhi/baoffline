import React, { Component } from 'react'
import { Layout, Input, Button, Table, Tree, Form, Modal, Upload, Icon, message } from 'antd'
import E from 'wangeditor'
import { connect } from 'react-redux'
import * as Actions from '@/store/actions'
import * as API from '@/fetch/index'

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
		}
	}
}

const TreeNode = Tree.TreeNode

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

// 附件上传 - todo 多文件 编辑
class FileWall extends React.Component {
	state = {
		fileList: []
	}
	static defaultProps = {
		onChange: () => {}
	}
	handleSuccess = (data, info) => {
		let fileList = [{
			name: 'fileUrl',
			url: data.data[0].url,
			uid: info.uid,
			status: 'done'
		}]
		this.props.onChange(fileList)
	}
	handleRemove = (data) => {
		this.setState({ fileList: [] })
		this.props.onChange()
	}
	handleChange = (data) => {
		let fileList = data.fileList
		this.setState({ fileList })
	}
	render() {
		let fileList = this.state.fileList
		let isFileUploadSuccess = fileList.length && fileList[0].status === 'done' ? true : false

		return (
			<Upload
				action={ API._uploadFile({ stationId: this.props.stationId }) }
				fileList={ fileList }
				onRemove={ this.handleRemove }
				onChange={ this.handleChange }
				onSuccess={ this.handleSuccess }>
				{ 	
					!isFileUploadSuccess && (
						<Button>
							<Icon type="upload" /> 文件上传
						</Button>
					)
				}
			</Upload>
		)
	}
}

// 视频上传 - todo 多文件 编辑
class VideoWall extends React.Component {
	state = {
		fileList: []
	}
	static defaultProps = {
		onChange: () => {}
	}
	handleSuccess = (data, info) => {
		let fileList = [{
			name: 'videoUrl',
			url: data.data[0].url,
			uid: info.uid,
			status: 'done'
		}]
		this.props.onChange(fileList)
	}
	handleRemove = (data) => {
		this.setState({ fileList: [] })
		this.props.onChange()
	}
	handleChange = (data) => {
		let fileList = data.fileList
		this.setState({ fileList })
	}
	render() {
		let fileList = this.state.fileList
		let isFileUploadSuccess = fileList.length && fileList[0].status === 'done' ? true : false

		return (
			<Upload
				action={ API._uploadVideo({ stationId: this.props.stationId }) }
				accept="video/*"
				fileList={ fileList }
				onRemove={ this.handleRemove }
				onChange={ this.handleChange }
				onSuccess={ this.handleSuccess }>
				{ 	
					!isFileUploadSuccess && (
						<Button>
							<Icon type="upload" /> 视频上传
						</Button>
					)
				}
			</Upload>
		)
	}
}

// 图片上传 - todo 多文件
class PicturesWall extends React.Component {
	state = {
		previewVisible: false,
		previewImage: '',
		fileList: this.props.value ? [{ name: 'imageUrl', uid: '1', url: this.props.value }] : []
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

	handleSuccess = (data, info) => {
		let fileList = [{
			name: 'imageUrl',
			url: data.data[0].url,
			uid: info.uid
		}]
		this.setState({ fileList })
		this.props.onChange(fileList[0].url)
	}

	render() {
		const { previewVisible, previewImage, fileList } = this.state;
		const uploadButton = (
			<div>
				<Icon type="plus" />
				<div className="ant-upload-text">图片上传</div>
			</div>
		)
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
					onSuccess={ this.handleSuccess }
					onRemove={ this.handleRemove }
				>
					{ fileList.length >= 1 ? null : uploadButton }
				</Upload>
				<Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
					<img alt="example" style={{ width: '100%' }} src={previewImage} />
				</Modal>
			</div>
		);
	}
}

// 添加/编辑表单
class ContentForm extends Component {
	formItemLayout = {
		labelCol: {
			span: 3
		},
		wrapperCol: {
			span: 12
		}
	}
	editItemLayout = {
		labelCol: {
			span: 3
		},
		wrapperCol: {
			span: 20
		}
	}
	render() {
		const { getFieldDecorator } = this.props.form

		return (
			<Form>
				<Form.Item {...this.formItemLayout} label="标题">
					{
						getFieldDecorator('title', {
							rules: [{ required: true, message: '请填标题' }],
						})(
							<Input />
						)
					}
				</Form.Item>
				<Form.Item {...this.formItemLayout} label="副标题">
					{
						getFieldDecorator('subTitle', {
							rules: [{ required: true, message: '请填副标题' }],
						})(
							<Input />
						)
					}
				</Form.Item>
				<Form.Item {...this.formItemLayout} label="图片">
					{
						getFieldDecorator('imageUrl', {
							
						})(
							<PicturesWall stationId={ this.props.stationId } />
						)
					}
				</Form.Item>
				<Form.Item {...this.formItemLayout} label="视频">
					{
						getFieldDecorator('videoUrl', {
							
						})(
							<VideoWall stationId={ this.props.stationId } />
						)
					}
				</Form.Item>
				<Form.Item {...this.formItemLayout} label="附件">
					{
						getFieldDecorator('fileUrl', {
							
						})(
							<FileWall stationId={ this.props.stationId } />
						)
					}
				</Form.Item>
				<Form.Item {...this.formItemLayout} label="外部链接">
					{
						getFieldDecorator('linkUrl', {
							
						})(
							<Input />
						)
					}
				</Form.Item>
				<Form.Item {...this.formItemLayout} label="内容摘要">
					{
						getFieldDecorator('summary', {
							
						})(
							<Input />
						)
					}
				</Form.Item>
				<Form.Item {...this.formItemLayout} label="作者">
					{
						getFieldDecorator('author', {
							
						})(
							<Input />
						)
					}
				</Form.Item>
				<Form.Item {...this.formItemLayout} label="来源">
					{
						getFieldDecorator('source', {
							
						})(
							<Input />
						)
					}
				</Form.Item>
				<Form.Item {...this.editItemLayout} label="内容">
					{
						getFieldDecorator('content', {

						})(
							<Editor />
						)
					}
				</Form.Item>
			</Form>
		)
	}
}

class Content extends Component {
	state = {
		addVisible: false,
		editVisible: false,
		currntContent: {},
		contentList: [],
		selectedRowKeys: [],
		selectedKey: 0
	}
	pageNo = 0
	pageSize = 10
	selectTreeNodeHandler = (selectedKeys, e) => {
		let nodeId = selectedKeys[0] * 1
		nodeId > 0 && this.loadList(nodeId, this.props.currentStationId, this.pageNo, this.pageSize)
	}
	handleSelectChange = (selectedRowKeys) => {
		this.setState({ selectedRowKeys })
	}
	handleAdd = (e) => {
		this.setState({ addVisible: true })
	}
	handleEdit = (data, index) => {
		this.setState({ 
			editVisible: true,
			currntContent: data
		})
	}
	handleDelete = (e) => {
		Modal.confirm({
			title: '确认删除',
			content: '确认删除所选内容？',
			okText: '确认',
			cancelText: '取消',
			onOk: this.submitDelete
		});
	}
	submitDelete = () => {
		let param = {
			data: {
				ids: this.state.selectedRowKeys
			}
		}
		API.deleteContent(param)
			.then(success => {
				this.reLoadList()
				this.setState({ selectedRowKeys: []})
				message.success('删除成功。')
			})
			.catch(error => {
				
			})
	}
	submitAdd = (param) => {
		API.addContent(param)
			.then(success => {
				this.addCancel()
				this.reLoadList()
				message.success('添加成功。')
			})
			.catch(error => {

			})
	}
	addCancel = () => {
		this.setState({ addVisible: false })
	}
	addOk = () => {
		this.refs.addForm.validateFieldsAndScroll((err, values) => {
			if (!err) {
				let param = {
					stationId : this.props.currentStationId,
					nodeId: this.state.selectedKey,
					data: values
				}
				this.submitAdd(param)
			}
		})
	}
	submitEdit = (param) => {
		API.updateContent(param)
			.then(success => {
				this.editCancel()
				this.loadList()
				message.success('修改成功。')
			})
			.catch(error => {

			})
	}
	editCancel = () => {
		this.setState({ editVisible: false })
	}
	editOk = () => {
		this.refs.editForm.validateFieldsAndScroll((err, values) => {
			if (!err) {
				let param = {
					data: {
						id: this.state.currntContent.id,
						...values
					}
				}
				this.submitEdit(param)
			}
		})
	}
	reLoadList() {
		let nodeId = this.state.selectedKey, 
			stationId = this.props.currentStationId, 
			pageNo = 0, 
			pageSize = this.pageSize
		this.loadList(nodeId, stationId, pageNo, pageSize)
	}
	loadList(nodeId = this.state.selectedKey, stationId = this.props.currentStationId, pageNo = this.pageNo, pageSize = this.pageSize) {
		API.getContentList({ nodeId, stationId, pageNo, pageSize })
			.then(success => {
				this.setState({
					contentList: success.data.data,
					selectedKey: nodeId || 0
				})
			})
			.catch(error => {

			})
	}
	getTreeNodes(pNodeId) {
		if (!pNodeId) return
		let node = this.props.nodes[pNodeId]
		return <TreeNode
			title={node.nodeName}
			key={pNodeId}
			selectable={!node.children || !node.children.length}>
			{node.children && node.children.map(nodeId => this.getTreeNodes(nodeId))}
		</TreeNode>
	}
	setSearch() {
		return (
			<div>
				<Input.Search
					placeholder="按标题搜索"
					onSearch={this.search} />
			</div>
		)
	}
	setOption() {
		return (
			<div className="cm-option">
				<Button onClick={this.handleAdd} type="primary" icon="plus" disabled={!this.state.selectedKey}>添加内容</Button>
				<Button onClick={this.handleDelete} disabled={!this.state.selectedRowKeys.length} type="danger">删除</Button>
			</div>
		)
	}
	setListOption = (data, datacopy, index) => {
		const onClick = () => {
			this.handleEdit(data, index)
		}
		return (
			<Button onClick={onClick} icon="edit" size="small" shape="circle"></Button>
		)
	}
	setList() {
		const { selectedRowKeys } = this.state;
		const rowSelection = {
			selectedRowKeys,
      		onChange: this.handleSelectChange,
		}
		const columns = [{
			title: '标题',
			dataIndex: 'title'
		}, {
			title: '添加日期',
			dataIndex: 'addDate'
		}, {
			title: '点击量',
		}, {
			title: '操作',
			render: this.setListOption
		}]
		return <Table
			rowSelection={rowSelection} 
			columns={columns} 
			dataSource={this.state.contentList} 
			rowKey="id" />
	}
	setNoData() {
		return <div className="cm-no-data">暂无数据</div>
	}
	setEditModal() {
		let options = {
			mapPropsToFields: (props) => {
				let currntContent = this.state.currntContent
				return {
					title: Form.createFormField({
						value: currntContent.title
					}),
					subTitle: Form.createFormField({
						value: currntContent.subTitle
					}),
					imageUrl: Form.createFormField({
						value: currntContent.imageUrl
					}),
					videoUrl: Form.createFormField({
						value: currntContent.videoUrl
					}),
					fileUrl: Form.createFormField({
						value: currntContent.fileUrl
					}),
					linkUrl: Form.createFormField({
						value: currntContent.linkUrl
					}),
					content: Form.createFormField({
						value: currntContent.content
					})
				}
			}
		}
		let EditFrom = Form.create(options)(ContentForm)
		return (
			<Modal
				title="编辑内容"
				okText="提交"
				cancelText="取消"
				width={1000}
				visible={ this.state.editVisible }
				onOk={ this.editOk }
				onCancel={ this.editCancel }>
				<EditFrom ref="editForm" data={this.state.currntContent} stationId={ this.props.currentStationId } />
			</Modal>
		)
	}
	setAddModal() {
		let AddFrom = Form.create()(ContentForm)
		return (
			<Modal
				title="添加内容"
				okText="添加"
				cancelText="取消"
				width={1000}
				visible={ this.state.addVisible }
				onOk={ this.addOk }
				onCancel={ this.addCancel }>
				<AddFrom ref="addForm" stationId={ this.props.currentStationId } />
			</Modal>
		)
	}
	search(queryStr) {
		// todo - 接口暂不支持模糊查询
	}
	render() {
		let indexNode = this.props.indexNode
		let dfId = indexNode.nodeId ? indexNode.nodeId.toString() : ''
		return (
			<Layout>
				<Layout.Sider className="fn-bg-grey station-tree-layout">
					<div className="station-tree fn-bg-grey">
						{
							dfId && (
								<Tree
									defaultExpandedKeys={[dfId]}
									onSelect={this.selectTreeNodeHandler}>
									{this.getTreeNodes(indexNode.nodeId)}
								</Tree>
							)
						}
					</div>
				</Layout.Sider>
				<Layout.Content className="fn-bg-white cm-content">
					{ this.setSearch() }
					{ this.setOption() }
					{ this.setAddModal() }
					{ this.setEditModal() }
					{ this.state.contentList.length ? this.setList() : this.setNoData() }
				</Layout.Content>
			</Layout>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Content)