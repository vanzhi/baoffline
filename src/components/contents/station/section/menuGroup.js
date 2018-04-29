import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Input, Button, Table, Modal, Form, message, Popconfirm} from 'antd'
import * as Actions from '@/store/actions'
import * as API from '@/fetch/index'

const Edit = 'Edit'
const Add = 'Add'

function mapStateToProps(state, ownProps) {
    return {
		currentStationId: state.currentStationId,
		nodeGroups: state.nodeGroups,
		nodeGroupList : state.nodeGroupsSort.map((item, index) => {
			return { ...state.nodeGroups[item], sort : index + 1 }
		})
    }
}

function mapDispatchToProps(dispatch) {
    return {
        refreshNodeGroups: (stationId) => {
			dispatch(Actions.getNodeGroups(stationId))
		}
    }
}

// 添加/编辑表单
class MenuGroupForm extends Component {
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
				<Form.Item { ...this.formItemLayout } label="栏目组名称">
					{
						getFieldDecorator('nodeGroupName', {
							rules: [{ required: true, message: '请填写栏目组名称' }]
						})(<Input />)
					}
				</Form.Item>
				<Form.Item { ...this.formItemLayout } label="栏目组摘要">
					{
						getFieldDecorator('description')(<Input.TextArea />)
					}
				</Form.Item>
			</Form>
		)
	}
} 

class MenuGroup extends Component {
	state = {
		compileVisible: false,
		compileType: Add,
		currentGroupName: null
	}
	compileForm = {}
	addNodeGroup = (e) => {
		this.setState({ compileVisible : true, compileType : Add })
	}
	editNodeGroup = (currentGroupName) => {
		this.setState({ compileVisible : true, compileType : Edit, currentGroupName })
	}
	detailNodeGroup = (currentGroupName) => {
		
	}
	compileOk = () => {
		let isAdd = this.state.compileType === Add
		this.compileForm.validateFieldsAndScroll((err, values) => {
			if (!err) {
				let param = {
					stationId : this.props.currentStationId,
					...values
				}
				if (isAdd) {
					this.addOk(param)
				} else {
					this.editOk(param)
				}
			}
		});
	}
	addOk = (param) => {
		API.addNodeGroup(param)
			.then(success => {
				message.success(`添加节点${param.nodeGroupName}成功`)
				this.setState({ compileVisible : false })
				this.props.refreshNodeGroups(this.props.currentStationId)
			}) 
			.catch(error => {
				
			})
	}
	editOk = (param) => {
		API.editNodeGroup(param)
			.then(success => {
				message.success(`编辑节点${param.nodeGroupName}成功`)
				this.setState({ compileVisible : false })
				this.props.refreshNodeGroups(this.props.currentStationId)
			}) 
			.catch(error => {
				
			})
	}
	deleteOk = (nodeGroupName) => {
		let param = {
			stationId : this.props.currentStationId,
			names: [nodeGroupName]
		}
		API.deleteNodeGroup(param)
			.then(success => {
				message.success(`删除${nodeGroupName}成功！`)
				this.props.refreshNodeGroups(this.props.currentStationId)
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
		return <Button type="primary" icon="plus" onClick={ this.addNodeGroup }>添加栏目组</Button>
	}
	setList() {
		let columns = [{
			title: '序号',
			dataIndex: 'sort'
		}, {
			title: '栏目组名称',
  			dataIndex: 'nodeGroupName'
		}, {
			title: '栏目组介绍',
  			dataIndex: 'description'
		}, {
			title: '操作',
			render: (text, record) => {
				let deleteHandler = () => this.deleteOk(record.nodeGroupName)
				let editHandler = () => {
					this.editNodeGroup(record.nodeGroupName)
				}
				let detailHandler = () => {
					this.detailNodeGroup(record.nodeGroupName)
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
				dataSource={ this.props.nodeGroupList }
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
		let currentGroup = this.props.nodeGroups[this.state.currentGroupName]
		let options = isAdd ? {} : {
			mapPropsToFields(props) {
				return {
					nodeGroupName: Form.createFormField({
						value: currentGroup.nodeGroupName
					}),
					description: Form.createFormField({
						value: currentGroup.description
					})
				}
			}
		}
		let CompileForm = Form.create(options)(MenuGroupForm)
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
				{ this.props.nodeGroupList.length ? this.setList() : this.setNoData() }
				{ this.setCompileModal() }
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuGroup)