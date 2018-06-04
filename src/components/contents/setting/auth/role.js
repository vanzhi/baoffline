import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input, Form, Select, TreeSelect, Row, Col, Collapse, Button, Card, Tag, List, Avatar, Pagination, Table, message, Modal, Icon } from 'antd'
import * as Actions from '@/store/actions'
import * as API from '@/fetch/index'
import Base from '@/config/base'
import Md5 from 'md5'

function mapStateToProps(state, ownProps) {
    return {
		
    }
}

function mapDispatchToProps(dispatch) {
    return {
		
    }
}

class RoleForm extends Component {
    formItemLayout = {
        labelCol: {
			span: 4
		},
		wrapperCol: {
			span: 8
		}
    }
    render() {
        let roleInfo = this.props.roleInfo || {}
        let { getFieldDecorator } = this.props.form
        return (
            <Form>
                <Form.Item { ...this.formItemLayout } label="角色名称" >
                    {	
                        getFieldDecorator('roleName', {
                            initialValue: roleInfo.roleName,
                            rules: [{ required: true, message: '请填写角色名称' }],
                        })(
                            <Input />
                        )
                    }
                </Form.Item>
                <Form.Item { ...this.formItemLayout } label="角色描述" >
                    {	
                        getFieldDecorator('roleDesc', {
                            initialValue: roleInfo.roleDesc
                        })(
                            <Input />
                        )
                    }
                </Form.Item>
            </Form>
        )
    }
}

class Role extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedRowKeys: [],
            roleList: [],
            total: 0,
            pageSize: 10,
            pageNo: 0,
            editVisible: false,
            addVisible: false
        }
        this.loadList()
    }
    handlePageChange = (pageNo) => {
        pageNo = pageNo - 1
        this.setState({ pageNo })
		this.loadList(pageNo)
    }
    handleSelectChange = (selectedRowKeys) => {
		this.setState({ selectedRowKeys })
    }
    handleAddOk = (e) => {
        this.refs.addForm.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let param = { ...values }
                this.submitAdd(param)
            }
        })
    }
    submitAdd(param) {
        API.addRole(param)
            .then(success =>{
                message.success('添加成功')
                this.reLoadList()
            })
            .catch(error => {
                message.warning('添加失败')
            })
    }
    reLoadList() {
        this.setState({ pageNo: 0 })
        this.loadList(0)
    }
    loadList(pageNo = this.state.pageNo, pageSize = this.pageSize) {
        let param = {
            pageNo, 
            pageSize
        }
        API.getRoleList(param)
            .then(success => {
                this.setState({ roleList : success.data })
            })
            .catch(error => {

            })
            
    }
    setListOption() {
        return
    }
    setList() {
        const { selectedRowKeys, total, pageNo } = this.state;
		const pagination = {
			onChange: this.handlePageChange,
			current: pageNo + 1,
			total: total
		}
		const rowSelection = {
			selectedRowKeys,
      		onChange: this.handleSelectChange,
		}
		const columns = [{
			title: '角色名称',
			dataIndex: 'roleName'
		}, {
			title: '描述',
			dataIndex: 'roleDesc'
		}, {
			title: '操作',
			render: this.setListOption
		}]
		return <Table
            className="fn-m-t-20"
			rowSelection={rowSelection} 
			columns={columns} 
			dataSource={this.state.roleList} 
			rowKey="id" 
			pagination={pagination}/>
    }
    setEditModal() {
		let EditForm = Form.create()(RoleForm)
		return (
			<Modal
				title="编辑角色"
				okText="提交"
				cancelText="取消"
				width={1000}
				visible={ this.state.editVisible }
				onOk={ this.editOk }
				onCancel={ () => this.setState({ editVisible: false }) }>
				<EditForm ref="editForm" roleInfo={this.state.currntRole} />
			</Modal>
		)
	}
	setAddModal() {
		let AddForm = Form.create()(RoleForm)
		return (
			<Modal
				title="创建角色"
				okText="提交"
				cancelText="取消"
				width={1000}
				visible={ this.state.addVisible }
				onOk={ this.handleAddOk }
				onCancel={ () => this.setState({ addVisible: false }) }>
				<AddForm ref="addForm" />
			</Modal>
		)
	}
    render() {
        return (
        <div className="cm-content">
            <Button onClick={ () => this.setState({ addVisible: true }) } icon="plus" type="primary">创建角色</Button>
            { this.state.roleList.length > 0 ? this.setList() : <div className="cm-no-data fn-m-t-20">暂无数据</div> }
            { this.setAddModal() }
            { this.setEditModal() }
        </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Role)