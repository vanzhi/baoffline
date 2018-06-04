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

class AccountForm extends Component {
	formItemLayout = {
		labelCol: {
			span: 3,
		},
		wrapperCol: {
            offset: 3,
			span: 18
		}
	}
    render() {
        const { getFieldDecorator } = this.props.form
        const userInfo = this.props.userInfo || {}
        const loginNameText = () => (
            <Form.Item {...this.formItemLayout}>
                { userInfo.loginName }
            </Form.Item>
        )
        const loginName = () => (
            <Form.Item {...this.formItemLayout} help={'大小写英文字母或数字'}>
                {
                    getFieldDecorator('loginName', {
                        rules: [{ 
                            required: true, 
                            message: '请填用户名' 
                        }, {
                            pattern : /^[0-9a-zA-Z]+$/ ,
                            message: '用户名填写错误' 
                        }],
                    })(
                        <Input prefix={<Icon type="user" />} placeholder="用户名" />
                    )
                }
            </Form.Item>
        )
        const loginPwd = () => (
            <Form.Item {...this.formItemLayout}>
                {
                    getFieldDecorator('loginPwd', {
                        rules: [{ required: true, message: '请填密码' }],
                    })(
                        <Input prefix={<Icon type="lock" />} type="password" placeholder={userInfo.id ? '修改密码' : '密码'} />
                    )
                }
            </Form.Item>
        )
        return <Form>
            { userInfo.id ? loginNameText() : loginName() }
            { userInfo.id ? '' : loginPwd() }
            <Form.Item {...this.formItemLayout}>
                {
                    getFieldDecorator('userName', {
                        initialValue: userInfo.userName,
                        rules: [{ required: true, message: '请填昵称' }],
                    })(
                        <Input placeholder="昵称" />
                    )
                }
            </Form.Item>
            <Form.Item {...this.formItemLayout}>
                {
                    getFieldDecorator('userPhone', {
                        initialValue: userInfo.userPhone,
                        validateTrigger: ['onBlur'],
                        rules: [{ pattern: /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/, message: '手机号填写错误' }],
                    })(
                        <Input placeholder="手机" />
                    )
                }
            </Form.Item>
            <Form.Item {...this.formItemLayout}>
                {
                    getFieldDecorator('userEmail', {
                        initialValue: userInfo.userEmail,
                        validateTrigger: ['onBlur'],
                        rules: [{
                            type: 'email', message: '邮箱地址不合法!',
                        }],
                    })(
                        <Input placeholder="邮箱" />
                    )
                }
            </Form.Item>
        </Form>
    }
}

class Account extends Component {
    state = {
        pageNo: 0,
        pageSize: 10,
        userList: [],
        totalCount: 0,
        addVisible: false,
        editVisible: false,
        currentUserInfo: {}
    }
    constructor(props) {
        super(props)
        this.getUserList()
    }
    handleAdd = (e) => {
        this.setState({ addVisible: true })
    }
    handleEdit = (userInfo) => {
        this.setState({ editVisible: true, currentUserInfo: userInfo })
    }
    handleAddOk = () => {
        this.refs.addForm.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let param = {
                    data: {
                        ...values,
                        loginPwd: Md5(values.loginPwd)
                    }
                }
                this.submitAdd(param)
            }
        })
    }
    handleAddCancel = () => {
        this.setState({ addVisible: false })
    }
    handlePageChange = (pageNo) => {
        this.setState({ pageNo: pageNo - 1 })
    }
    handleEditOk = () => {
        this.refs.editForm.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let param = {
                    data: {
                        userName: values.userName,
                        userPhone: values.userPhone,
                        userEmail: values.userEmail,
                        id: this.state.currentUserInfo.id
                    }
                }
                this.submitEdit(param)
            }
        })
    }
    handleEditCancel = () => {
        this.setState({ editVisible: false })
    }
    submitAdd(param) {
        API.addUser(param)
            .then(success => {
                message.success('新增用户成功')
                this.setState({ addVisible: false })
                this.reLoadUserList()
            })
            .catch(error => {
                message.success('新增用户失败')
            })
    }
    submitEdit(param) {
        API.updateUser(param)
            .then(success => {
                message.success('编辑用户成功')
                this.setState({ editVisible: false })
                this.getUserList()
            })
            .catch(error => {
                message.success('编辑用户失败')
            })
    }
    reLoadUserList() {
        this.setState({ pageNo: 0 })
        this.getUserList(0)
    }
    getUserList(pageNo = this.state.pageNo, pageSize = this.state.pageSize) {
        let param = {
            data: {
                pageNo,
                pageSize
            }
        }
        API.getUserList(param)
            .then(success => {
                this.setState({
                    userList: success.data.data || [], 
                    totalCount: success.data.totalCount || 0
                })
            })
            .catch(error => {

            })
    }
    setUserList() {
        let columns = [{
            title: '用户名',
            dataIndex: 'loginName'
        }, {
            title: '昵称',
            dataIndex: 'userName'
        }, {
            title: '手机',
            dataIndex: 'userPhone'
        }, {
            title: '注册时间',
            dataIndex: 'createTime'
        }, {
            title: '操作',
            render: (text, record) => {
                return <Button onClick={() => { this.handleEdit(record) }} shape="circle" icon="edit" />
            }
        }]
        return <Table
            columns={ columns } 
            dataSource={ this.state.userList }
            pagination={{
                current: this.state.pageNo + 1,
                total: this.state.totalCount,
                pageSize: this.state.pageSize,
                onChange: this.handlePageChange
            }} 
            rowKey="id"
            className="fn-m-t-20">
        </Table>
    }
    setAddUserModal() {
        let AddForm = Form.create()(AccountForm)
        return <Modal
            title="添加"
            visible={ this.state.addVisible }
            onOk={ this.handleAddOk }
            onCancel={ this.handleAddCancel }
            okText="确定"
            cancelText="取消">
            <AddForm ref="addForm" />
        </Modal>
    }
    setEditUserModal() {
        let EditForm = Form.create()(AccountForm)
        return <Modal
            title="编辑"
            visible={this.state.editVisible}
            onOk={ this.handleEditOk }
            onCancel={ this.handleEditCancel }
            okText="确定"
            cancelText="取消">
            <EditForm userInfo={this.state.currentUserInfo} ref="editForm" />
        </Modal>
    }
	render() {
		return (
            <div className="cm-content">
                <Button onClick={this.handleAdd} icon="plus" type="primary">添加用户</Button>
                { this.setUserList() }
                { this.setAddUserModal() }
                { this.setEditUserModal() }
            </div>
        )
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Account)