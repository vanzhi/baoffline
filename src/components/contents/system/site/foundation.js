import React, { Component } from 'react'
import { Layout, Input, Button, Table, Tree, Form, Modal, Upload, Icon, message, Checkbox, Radio, Tag, Spin, Select, Card, TreeSelect, Popconfirm } from 'antd'
import { connect } from 'react-redux'
import * as Actions from '@/store/actions'
import * as API from '@/fetch/index'
import Base from '@/config/base'
import Utils from '@/utils/utils'

function mapStateToProps(state, ownProps) {
    let indexStationIds = []
    let stations = state.stations ? { ...state.stations } : {}
    for (var key in stations) {
        if (!stations[key].parentDomainId) {
            indexStationIds.push(key * 1)
        }
    }
	return {
        indexStationIds,
		stations
	}
}

function mapDispatchToProps(dispatch) {
	return {
		refreshStations: () => {
			dispatch(Actions.getStations())
		}
	}
}

class SiteForm extends Component {
    formItemLayout = {
		labelCol: {
			span: 6
		},
		wrapperCol: {
			span: 16
		}
    }
    getTreeNodes(pNodeId, isDisabled = false) {
		if (!pNodeId) return
        let node = this.props.stations[pNodeId]
        isDisabled = isDisabled || pNodeId === this.props.stationId * 1
		return <TreeSelect.TreeNode 
                    title={ node.domainName } 
                    value={ pNodeId + '' }
					key={ pNodeId } 
                    disabled={ isDisabled }>
					{ node.children && node.children.map(nodeId => this.getTreeNodes(nodeId, isDisabled)) }
				</TreeSelect.TreeNode>
    }
	render() {
        const { getFieldDecorator } = this.props.form
        const isEdit = this.props.stationId ? true : false
        const defaultPId = isEdit || !this.props.defaultPId ? '' : (this.props.defaultPId + '')
        const node = this.props.stationId ? this.props.stations[this.props.stationId] : {}
		return (
			<Form>
                <Form.Item {...this.formItemLayout} label="上级节点">
                    {
                        getFieldDecorator('parentDomainId', {
                            initialValue: isEdit ? (node.parentDomainId || '') + '' : defaultPId,
						})(
                            <TreeSelect 
                                showSearch={ true }
                                allowClear
                                treeDefaultExpandAll>
                                {
                                    this.props.indexStationIds.map((item, index) => {
                                        return this.getTreeNodes(item)
                                    })
                                }
                            </TreeSelect>
						)
                    }
				</Form.Item>
                <Form.Item {...this.formItemLayout} label="站点名称">
					{
						getFieldDecorator('domainName', {
                            initialValue: isEdit ? node.domainName : '',
							rules: [{ required: true, message: '请填写站点名称' }],
						})(
							<Input />
						)
					}
				</Form.Item>
				<Form.Item {...this.formItemLayout} label="站点节点路径">
					{
						getFieldDecorator('domainSystemDir', {
                            initialValue: isEdit ? node.domainSystemDir : '',
							rules: [{ required: true, message: '请填写站点节点路径' }],
						})(
							<Input />
						)
					}
				</Form.Item>
                <Form.Item {...this.formItemLayout} label="站点访问url">
					{
						getFieldDecorator('domainSystemUrl', {
                            initialValue: isEdit ? node.domainSystemUrl : '',
							rules: [{ required: true, message: '请填写站点访问url' }],
						})(
							<Input />
						)
					}
				</Form.Item>
			</Form>
		)
	}
}

class Foundation extends Component {
    state = {
        addFormVisible: false,
        editFormVisible: false,
        selectStationId: ''
    }
    handleAddSite = () => {
        this.setState({ addFormVisible: true })
    }
    handleEditSite = () => {
        this.setState({ editFormVisible: true })
    }
    handleAddSiteOk = () => {
        this.refs.addForm.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let param = {
                    data: {
                        ...values,
                        parentDomainId: values.parentDomainId * 1 || 0
                    }
                }
                this.submitAdd(param)
            }
        })
    }
    handleAddSiteCancel = () => {
        this.setState({ addFormVisible: false })
    }
    handleEditSiteOk = () => {
        this.refs.editForm.validateFieldsAndScroll((err, values) => {
            if (!err) {
                let param = {
                    data: {
                        ...values,
                        id: this.state.selectStationId * 1,
                        parentDomainId: values.parentDomainId * 1 || 0
                    }
                }
                this.submitEdit(param)
            }
        })
    }
    handleEditSiteCancel = () => {
        this.setState({ editFormVisible: false })
    }
    handleDeleteSiteOk = () => {
        let param = {
            stationId: this.state.selectStationId * 1
        }
        API.deleteStation(param)
            .then(success => {
                message.success('删除站点成功！')
                this.props.refreshStations()
            })
    }
    handleStationSelect = (stationIds) => {
        let selectStationId = stationIds[0]
        selectStationId && this.setState({ selectStationId })
    }
    submitAdd(param) {
        API.addStation(param)
            .then(success => {
                message.success('添加成功')
                this.props.refreshStations()
                this.setState({ addFormVisible: false })
            })
            .catch(error => {
                message.warning('添加失败')
            })
    }
    submitEdit(param) {
        API.updateStation(param)
            .then(success => {
                message.success('编辑成功')
                this.props.refreshStations()
                this.setState({ editFormVisible: false })
            })
            .catch(error => {
                message.warning('编辑失败')
            })
    }
    getNodeTitle(node) {
        return (
            <div className="cm-edit-node">
                <span className="title">{ node.domainName }</span>
                <span className="operate">
                    <Button onClick={this.handleEditSite} shape="circle" icon="edit" size="small"></Button>
                    <Popconfirm
                        title="确定删除该站点及其子站点？" 
                        onConfirm={this.handleDeleteSiteOk} 
                        okText="确定" 
                        cancelText="再想想">
                        <Button shape="circle" icon="delete" size="small"></Button>
                    </Popconfirm>
                </span>
            </div>
        )
    }
    getTreeNodes(pNodeId) {
		if (!pNodeId) return
		let node = this.props.stations[pNodeId]
		return <Tree.TreeNode 
					title={ this.getNodeTitle(node) } 
					key={ pNodeId } >
					{ node.children && node.children.map(nodeId => this.getTreeNodes(nodeId)) }
				</Tree.TreeNode>
    }
    setAddModal() {
        let AddForm = Form.create()(SiteForm)
        return <Modal
            title="新增"
            visible={this.state.addFormVisible}
            onOk={this.handleAddSiteOk}
            onCancel={this.handleAddSiteCancel}
            okText="确定"
            cancelText="取消">
            <AddForm 
                ref="addForm"
                defaultPId={this.state.selectStationId}
                pNodeId={this.state.selectStationId} 
                stations={this.props.stations}
                indexStationIds={this.props.indexStationIds}/>
        </Modal>
    }
    setEditModal() {
        let EditForm = Form.create()(SiteForm)
        return <Modal
            title="编辑"
            visible={this.state.editFormVisible}
            onOk={this.handleEditSiteOk}
            onCancel={this.handleEditSiteCancel}
            okText="确定"
            cancelText="取消">
            <EditForm 
                ref="editForm"
                stationId={this.state.selectStationId}
                stations={this.props.stations}
                indexStationIds={this.props.indexStationIds}/>
        </Modal>
    }
	render() {
		return (
            <div className="cm-content">
                <Button onClick={this.handleAddSite} type="primary" icon="plus">新增站点</Button>
                <Card title="站点列表" bordered={false}>
                    <Tree
                        className="cm-bigger-tree"
                        selectedKeys={[this.state.selectStationId]}
                        onSelect={ this.handleStationSelect }
                        defaultExpandAll>
                        {
                            this.props.indexStationIds.map((item, index) => {
                                return this.getTreeNodes(item)
                            })
                        }
                    </Tree>
                </Card>
                { this.setAddModal() }
                { this.setEditModal() }
            </div>
        )
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Foundation)