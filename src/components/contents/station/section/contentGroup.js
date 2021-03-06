import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input, Button, Table, Modal, Form, message, Popconfirm} from 'antd'
import * as Actions from '@/store/actions'
import * as API from '@/fetch/index'

const Edit = 'Edit'
const Add = 'Add'

function mapStateToProps(state, ownProps) {
    return {
		currentStationId: state.currentStationId,
		contentGroups: state.contentGroups,
		contentGroupList : state.contentGroupsSort.map((item, index) => {
			return { ...state.contentGroups[item], sort : index + 1 }
		})
    }
}

function mapDispatchToProps(dispatch) {
    return {
        refreshContentGroups: (stationId) => {
			dispatch(Actions.getContentGroups(stationId))
		}
    }
}

// 添加/编辑表单
class ContentGroupForm extends Component {
	formItemLayout = {
		labelCol: {
			span: 6
		},
		wrapperCol: {
			span: 16
		}
	}
	render() {
		const { getFieldDecorator } = this.props.form
		return (
			<Form>
				<Form.Item { ...this.formItemLayout } label="内容组名称">
					{
						getFieldDecorator('contentGroupName', {
							rules: [{ required: true, message: '请填写内容组名称' }]
						})(<Input />)
					}
				</Form.Item>
				<Form.Item { ...this.formItemLayout } label="内容组摘要">
					{
						getFieldDecorator('description')(<Input.TextArea />)
					}
				</Form.Item>
			</Form>
		)
	}
} 

class ContentGroup extends Component {
	state = {
		compileVisible: false,
		compileType: Add,
		currentGroupId: 0
	}
	compileForm = {}
	addContentGroup = (e) => {
		this.setState({ compileVisible : true, compileType : Add })
	}
	editContentGroup = (currentGroupId, b, c) => {
		this.setState({ compileVisible : true, compileType : Edit, currentGroupId })
	}
	detailContentGroup = (currentGroupId) => {
		
	}
	compileOk = () => {
		let isAdd = this.state.compileType === Add
		this.compileForm.validateFieldsAndScroll((err, values) => {
			if (!err) {
				if (isAdd) {
					let param = {
						data: {
							domainId : this.props.currentStationId,
							...values
						}
					}
					this.addOk(param)
				} else {
					let param = {
						data: {
							id: this.state.currentGroupId,
							...values
						}
					}
					this.editOk(param)
				}
			}
		});
	}
	addOk = (param) => {
		API.addContentGroup(param)
			.then(success => {
				message.success(`添加节点${param.contentGroupName}成功`)
				this.setState({ compileVisible : false })
				this.props.refreshContentGroups(this.props.currentStationId)
			}) 
			.catch(error => {
				
			})
	}
	editOk = (param) => {
		API.editContentGroup(param)
			.then(success => {
				message.success(`编辑节点${param.contentGroupName}成功`)
				this.setState({ compileVisible : false })
				this.props.refreshContentGroups(this.props.currentStationId)
			}) 
			.catch(error => {
				
			})
	}
	deleteOk = (id) => {
		let contentGroup = this.props.contentGroups[id]
		let param = {
			data: {
				ids: [id]
			}
		}
		API.deleteContentGroup(param)
			.then(success => {
				message.success(`删除${contentGroup.contentGroupName}成功！`)
				this.props.refreshContentGroups(this.props.currentStationId)
			})
			.catch(error => {
				
			})
	}
	compileCancel = () => {
		this.setState({ compileVisible : false })
	}
	refCompileForm = (form) => {
		if (form) {
			this.compileForm = form
		}
	}
	setOption() {
		return <Button type="primary" icon="plus" onClick={ this.addContentGroup }>添加内容组</Button>
	}
	setList() {
		let columns = [{
			title: '序号',
			dataIndex: 'sort'
		}, {
			title: '内容组名称',
  			dataIndex: 'contentGroupName'
		}, {
			title: '内容组介绍',
  			dataIndex: 'description'
		}, {
			title: '操作',
			render: (text, record) => {
				let deleteHandler = () => this.deleteOk(record.id)
				let editHandler = () => {
					this.editContentGroup(record.id)
				}
				let detailHandler = () => {
					this.detailContentGroup(record.id)
				}
				return (
					<div>
						<Button icon="bars" onClick={ detailHandler }></Button>
						<Button icon="edit" onClick={ editHandler }></Button>
						<Popconfirm
							title="确认删除？"
							onConfirm={ deleteHandler }
							cancelText="取消"
							okText="确认">
							<Button icon="delete" type="danger"></Button>
						</Popconfirm>
					</div>
				)
			}
		}]
		return (
			<Table 
				columns={ columns } 
				dataSource={ this.props.contentGroupList }
				pagination={ false } 
				rowKey="sort"
				className="fn-m-t-20">
			</Table>
		)
	}
	setNoData() {
		return <div className="cm-no-data fn-m-t-20">暂无数据</div>
	}
	// 设置编辑/添加的操作弹窗
	setCompileModal() {
		let isAdd = this.state.compileType === Add
		let currentGroup = this.props.contentGroups[this.state.currentGroupId]
		let options = isAdd ? {} : {
			mapPropsToFields(props) {
				return {
					contentGroupName: Form.createFormField({
						value: currentGroup.contentGroupName
					}),
					description: Form.createFormField({
						value: currentGroup.description
					})
				}
			}
		}
		let CompileForm = Form.create(options)(ContentGroupForm)
		return (
			<Modal
				title={ isAdd ? '添加' : '编辑' }
				okText="确定"
				cancelText="取消"
				visible={ this.state.compileVisible }
				onOk={ this.compileOk }
				onCancel={ this.compileCancel } >
				<CompileForm ref={ this.refCompileForm }></CompileForm>
			</Modal>
		)
	}
	render() {
		return (
			<div className="cm-content">
				{ this.setOption() }
				{ this.props.contentGroupList.length ? this.setList() : this.setNoData() }
				{ this.setCompileModal() }
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentGroup)