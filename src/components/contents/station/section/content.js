import React, { Component } from 'react'
import { Layout, Input, Button, Table, Tree, Form, Modal, Upload, Icon, message, Checkbox, Radio, Tag, Spin, Select } from 'antd'
import E from 'wangeditor'
import { connect } from 'react-redux'
import * as Actions from '@/store/actions'
import * as API from '@/fetch/index'
import Base from '@/config/base'
import Utils from '@/utils/utils'

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

// 内容组
class GroupList extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			fetching: false,
			data: [],
			value: []
		}
	}
	handleSearch = (value) => {
		
	}
	handleChange = (value) => {

	}
	render() {
		const { fetching, data, value } = this.state
		return (
			<Select
				mode="multiple"
				labelInValue
				value={value}
				placeholder="选择内容组"
				notFoundContent={fetching ? <Spin size="small" /> : null}
				filterOption={false}
				onSearch={this.handleSearch}
				onChange={this.handleChange}
				style={{ width: '100%' }}>
				{
					data.map(d => <Select.Option key={d.value}>{d.text}</Select.Option>)
				}
			</Select>
		)
	}
}

// 关键字
class KeyWords extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			tags: props.value ? props.value.split(',') : [],
			inputVisible: false,
			inputValue: ''
		}
	}
	static defaultProps = {
		onChange: () => {}
	}
	handleAfterClose = (key, index) => {
		let tags = this.state.tags.filter(tag => tag !== key)
		this.setState({ tags })
	}
	handleInputChange = (e) => {
		this.setState({ inputValue: e.target.value.trim() })
	}
	handleInputConfirm = (e) => {
		let value = e.target.value.trim()
		let param = {
			inputVisible: false,
			inputValue: ''
		}
		if (value && this.state.tags.indexOf(value) < 0) {
			param.tags = this.state.tags
			param.tags.push(value)
			this.props.onChange(param.tags.join(','))
		}
		this.setState(param)
	}
	showInput = () => {
		this.setState({
			inputVisible: true
		}, () => {
			this.input.focus()
		})
	}
	saveInputRef = (input) => {
		this.input = input
	}
	render() {
		let { inputVisible, tags, inputValue } = this.state
		return (
			<div>
				{
					tags.map((item, index) => {
						return (
							<Tag 
								key={item} 
								afterClose={() => this.handleAfterClose(item, index)} 
								closable>
								{ item }
							</Tag>
						)
					})
				}
				{
					inputVisible 
					&& <Input
						ref={this.saveInputRef}
						type="text"
						size="small"
						style={{ width: 78 }}
						value={inputValue}
						onChange={this.handleInputChange}
						onBlur={this.handleInputConfirm}
						onPressEnter={this.handleInputConfirm}/> 
					||
					<Tag
						onClick={this.showInput}
						style={{ background: '#fff', borderStyle: 'dashed' }}>
						<Icon type="plus" />新增关键字
					</Tag>
				}
			</div>
			
		)
	}
}

// 附件上传
class FileWall extends React.Component {
	constructor(props) {
		super(props)
		let fileList = props.value ? props.value.split(',').map(function (item, index) {
			return {
				name: item || index,
				url: item,
				uid: item || index,
				status: 'done'
			}
		}) : []
		this.state = {
			fileList
		}
	}
	static defaultProps = {
		onChange: () => {}
	}
	handleRemove = (data) => {
		this.props.onChange()
	}
	handleChange = (data) => {
		let fileList = data.fileList
		let isAllDone = true
		let urls = []
		for (let i = 0; i < fileList.length; i ++) {
			let file = fileList[i]
			if (file.status === 'done' && file.response && file.response.code === 1000) {
				urls.push(file.response.data[0].url)
			} else {
				isAllDone = false
				break
			}
		}
		if (isAllDone) {
			this.props.onChange(urls.join(','))
		}
		this.setState({ fileList })
	}
	render() {
		let fileList = this.state.fileList

		return (
			<Upload
				action={ API._uploadFile({ stationId: this.props.stationId }) }
				fileList={ fileList }
				onRemove={ this.handleRemove }
				onChange={ this.handleChange }
				multiple>
				<Button><Icon type="upload" /> 文件上传</Button>
			</Upload>
		)
	}
}

// 视频上传 
class VideoWall extends React.Component {
	constructor(props) {
		super(props)
		let fileList = props.value ? props.value.split(',').map(function (item, index) {
			return {
				name: item || index,
				url: item,
				uid: item || index,
				status: 'done'
			}
		}) : []
		this.state = {
			fileList
		}
	}
	static defaultProps = {
		onChange: () => {}
	}
	handleRemove = (data) => {
		this.setState({ fileList: [] })
		this.props.onChange()
	}
	handleChange = (data) => {
		let fileList = data.fileList
		let isAllDone = true
		let urls = []
		for (let i = 0; i < fileList.length; i ++) {
			let file = fileList[i]
			if (file.status === 'done' && file.response && file.response.code === 1000) {
				urls.push(file.response.data[0].url)
			} else {
				isAllDone = false
				break
			}
		}
		if (isAllDone) {
			this.props.onChange(urls.join(','))
		}
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
				multiple>
				<Button><Icon type="upload" /> 视频上传</Button>
			</Upload>
		)
	}
}

// 图片上传
class PicturesWall extends React.Component {
	constructor(props) {
		super(props)
		let fileList = props.value ? props.value.split(',').map(function (item, index) {
			return {
				name: item || index,
				url: item,
				uid: item || index,
				status: 'done'
			}
		}) : []
		this.state = {
			previewVisible: false,
			previewImage: '',
			fileList
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
		let fileList = data.fileList
		let isAllDone = true
		let urls = []
		for (let i = 0; i < fileList.length; i ++) {
			let file = fileList[i]
			if (file.status === 'done' && file.response && file.response.code === 1000) {
				urls.push(file.response.data[0].url)
			} else {
				isAllDone = false
				break
			}
		}
		if (isAllDone) {
			this.props.onChange(urls.join(','))
		}
		this.setState({ fileList })
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
					<div>
						<Icon type="plus" />
						<div className="ant-upload-text">图片上传</div>
					</div>
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
		const options = [{
			label: '推荐',
			value: 'isRecommend'
		}, {
			label: '热点',
			value: 'isHot'
		}, {
			label: '置顶',
			value: 'isTop'
		}, {
			label: '醒目',
			value: 'isColor'
		}]
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
				<Form.Item {...this.formItemLayout} label="内容属性">
					{
						getFieldDecorator('contentPropGroup', {
							
						})(
							<Checkbox.Group options={options}></Checkbox.Group>
						)
					}
				</Form.Item>
				<Form.Item {...this.formItemLayout} label="APP样式">
					{
						getFieldDecorator('appType', {
							rules: [{ required: true, message: '请选择app样式' }],
						})(
							<Radio.Group>
								<Radio value={0}>无图</Radio>
								<Radio value={1}>小图</Radio>
								<Radio value={2}>大图</Radio>
								<Radio value={3}>多图</Radio>
								<Radio value={4}>视频</Radio>
							</Radio.Group>
						)
					}
				</Form.Item>
				<Form.Item {...this.formItemLayout} label="权限">
					{
						getFieldDecorator('readType', {
							rules: [{ required: true, message: '请选择权限' }],
						})(
							<Radio.Group>
								{
									Utils.each(Base.readType, (item, key) => {
										return <Radio value={key * 1} key={ key }>{ item }</Radio>
									})
								}
							</Radio.Group>
						)
					}
				</Form.Item>
				<Form.Item {...this.formItemLayout} label="状态">
					{
						getFieldDecorator('checkedLevel', {
							rules: [{ required: true, message: '请选择状态' }],
						})(
							<Radio.Group>
								<Radio value={0}>保持不变</Radio>
								<Radio value={1}>草稿</Radio>
								<Radio value={2}>待审核</Radio>
								<Radio value={3}>发布</Radio>
							</Radio.Group>
						)
					}
				</Form.Item>
				<Form.Item {...this.editItemLayout} label="关键字">
					{
						getFieldDecorator('tags', {
							
						})(
							<KeyWords />
						)
					}
				</Form.Item>
				<Form.Item {...this.formItemLayout} label="内容组">
					{/* todo缺模糊搜索内容组接口 */}
					{/* {
						getFieldDecorator('contentGroupIds', {
							
						})(
							<GroupList />
						)
					} */}
				</Form.Item>
				<Form.Item {...this.editItemLayout} label="内容">
					{
						getFieldDecorator('content', {
							rules: [{ required: true, message: '请输入内容' }],
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
		selectedKey: 0,
		totalPage: 1,
		pageNo: 0,
		pageSize: 10
	}
	selectTreeNodeHandler = (selectedKeys, e) => {
		let nodeId = selectedKeys[0] * 1,
			stationId = this.props.currentStationId,
			pageSize = this.state.pageSize
		if (nodeId > 0) {
			this.loadList(nodeId, stationId, 0, pageSize)
		}
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
	handlePageChange = (pageNo) => {
		let nodeId = this.state.selectedKey,
			stationId = this.props.currentStationId
		this.loadList(nodeId, stationId, pageNo - 1)
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
					data: {
						...this.requestParamFilter(values)
					}
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
						...this.requestParamFilter(values),
					}
				}
				this.submitEdit(param)
			}
		})
	}
	requestParamFilter(values) {
		let contentPropGroup = values.contentPropGroup || []
		delete values.contentPropGroup
		return {
			...values,
			isRecommend: contentPropGroup.indexOf('isRecommend') > -1 ? 0 : 1,
			isHot: contentPropGroup.indexOf('isHot') > -1 ? 0 : 1,
			isTop: contentPropGroup.indexOf('isTop') > -1 ? 0 : 1,
			isColor: contentPropGroup.indexOf('isColor') > -1 ? 0 : 1,
		}
	}
	reLoadList() {
		let nodeId = this.state.selectedKey,
			stationId = this.props.currentStationId, 
			pageNo = 0,
			pageSize = this.pageSize
		this.setState({ pageNo })
		this.loadList(nodeId, stationId, pageNo, pageSize)
	}
	loadList(nodeId = this.state.selectedKey, stationId = this.props.currentStationId, pageNo = this.state.pageNo, pageSize = this.state.pageSize) {
		let params = {}
		if (nodeId !== this.state.selectedKey) {
			params.selectedKey = nodeId
		}
		if (pageNo !== this.state.pageNo) {
			params.pageNo = pageNo
		}
		if (pageSize !== this.state.pageSize) {
			params.pageSize = pageSize
		}
		if (Object.keys(params).length > 0) {
			this.setState({ ...params })
		}
		API.getContentList({ nodeId, stationId, data: { pageNo, pageSize } })
			.then(success => {
				let { data, totalCount } = success.data
				this.setState({
					contentList: data,
					selectedKey: nodeId || 0,
					totalPage: totalCount
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
		const { selectedRowKeys, totalPage, pageNo } = this.state;
		const pagination = {
			onChange: this.handlePageChange,
			current: pageNo + 1,
			total: totalPage
		}
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
			title: '状态',
			render: (data) => {
				let status = {
					0: '默认',
					1: '草稿',
					2: '待审核',
					3: '发布'
				}
				return status[data.checkedLevel]
			}
		}, {
			title: '操作',
			render: this.setListOption
		}]
		return <Table
			rowSelection={rowSelection} 
			columns={columns} 
			dataSource={this.state.contentList} 
			rowKey="id" 
			pagination={pagination}/>
	}
	setNoData() {
		return <div className="cm-no-data">暂无数据</div>
	}
	setEditModal() {
		let options = {
			mapPropsToFields: (props) => {
				let currntContent = this.state.currntContent
				let contentPropGroup = []
				currntContent.isRecommend == 1 && contentPropGroup.push('isRecommend')
				currntContent.isHot == 1 && contentPropGroup.push('isHot')
				currntContent.isTop == 1 && contentPropGroup.push('isTop')
				currntContent.isColor == 1 && contentPropGroup.push('isColor')
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
					summary: Form.createFormField({
						value: currntContent.summary
					}),
					author: Form.createFormField({
						value: currntContent.author
					}),
					source: Form.createFormField({
						value: currntContent.source
					}),
					contentPropGroup: Form.createFormField({
						value: contentPropGroup
					}),
					appType: Form.createFormField({
						value: currntContent.appType
					}),
					readType: Form.createFormField({
						value: currntContent.readType
					}),
					tags: Form.createFormField({
						value: currntContent.tags
					}),
					checkedLevel: Form.createFormField({
						value: currntContent.checkedLevel
					}),
					content: Form.createFormField({
						value: currntContent.content
					})
				}
			}
		}
		let EditForm = Form.create(options)(ContentForm)
		return (
			<Modal
				title="编辑内容"
				okText="提交"
				cancelText="取消"
				width={1000}
				visible={ this.state.editVisible }
				onOk={ this.editOk }
				onCancel={ this.editCancel }>
				<EditForm ref="editForm" data={this.state.currntContent} stationId={ this.props.currentStationId } />
			</Modal>
		)
	}
	setAddModal() {
		let AddForm = Form.create()(ContentForm)
		return (
			<Modal
				title="添加内容"
				okText="添加"
				cancelText="取消"
				width={1000}
				visible={ this.state.addVisible }
				onOk={ this.addOk }
				onCancel={ this.addCancel }>
				<AddForm ref="addForm" stationId={ this.props.currentStationId } />
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