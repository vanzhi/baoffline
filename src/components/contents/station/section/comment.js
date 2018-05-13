import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input, Form, Select, TreeSelect, Row, Col, Collapse, Button, Card, Tag, List, Avatar, Pagination, Table, message } from 'antd'
import * as Actions from '@/store/actions'
import * as API from '@/fetch/index'
import Base from '@/config/base'
import Logo from '@/assets/logo.png';

const TreeNode = TreeSelect.TreeNode

function mapStateToProps(state, ownProps) {
    return {
		currentStationId: state.currentStationId,
		indexNode: state.nodes[state.indexNodeId] || {},
        nodes: state.nodes
    }
}

function mapDispatchToProps(dispatch) {
    return {
		
    }
}

class Comment extends Component {
	state = {
		selectNodeId: 0,
		selectContent: {},
		panelVisible: false,
		commentList: [],
		commentTotal: 0,
		pageNo: 0,
		pageSize: 10,
		cpageNo: 0,
		cpageSize: 10,
		contentList: [],
		contentTotal: 0
	}
	handleSelectTreeChange = (v, vs, { triggerNode }) => {
		let nodeId = triggerNode ? triggerNode.props.eventKey * 1 : 0
		this.setState({ selectNodeId: nodeId, panelVisible: nodeId ? true : false })
		this.getContentList(nodeId, 0)
	}
	handleSelectContent = (item) => {
		this.setState({ selectContent: item })
		this.getCommentList(item.id, 0)
	}
	handleContentPageNoChange = (pageNo) => {
		pageNo = pageNo - 1
		this.setState({ cpageNo: pageNo })
		this.getContentList(this.state.selectNodeId, pageNo)
	}
	getTreeNodes(pNodeId) {
		if (!pNodeId) return
		let node = this.props.nodes[pNodeId]
		return <TreeNode 
					title={ node.nodeName } 
					key={ pNodeId } 
					value={ node.nodeName }
					selectable={ !node.children || !node.children.length }>
					{ node.children && node.children.map(nodeId => this.getTreeNodes(nodeId)) }
				</TreeNode>
	}
	getContentList(selectNodeId = this.state.selectNodeId, pageNo = this.state.cpageNo, pageSize = this.state.cpageSize) {
		let param = {
			stationId: this.props.currentStationId,
			nodeId: selectNodeId,
			data: {
				pageSize,
				pageNo
			}
		}
		API.getContentList(param)
			.then(success => {
				let { data, totalCount } = success.data
				this.setState({
					contentList: data,
					contentTotal: totalCount
				})
			})
			.catch(error => {
				
			})
	}
	getCommentList(contentId = this.state.selectContent.id, pageNo = this.state.pageNo, pageSize = this.state.pageSize) {
		let param = {
			contentId,
			data: {
				pageNo,
				pageSize
			}
		}
		API.getCommentList(param)
			.then(success => {

			})
			.catch(error => {
				this.setState({ conmmentList: [], commentTotal: 0 })
				message.warning('获取评论列表失败')
			})
	}
	setTreeSelect() {
		let indexNode = this.props.indexNode
		return (
			<Row gutter={ 20 } type="flex" align="middle">
				<Col span={ 12 }>
					<TreeSelect
						placeholder="请选择栏目"
						style={{ width: '100%' }}
						dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
						onChange={ this.handleSelectTreeChange }
						allowClear
						treeDefaultExpandAll
						showSearch>
						{ this.getTreeNodes(indexNode.nodeId) }
					</TreeSelect>
				</Col>
				<Col span={ 1 }>
					{ this.state.selectNodeId > 0 && <Button shape="circle" icon={ this.state.panelVisible ? 'up' : 'down' } onClick={() => { this.setState({ panelVisible: !this.state.panelVisible }) }}></Button> }
				</Col>
				<Col span={ 9 }>
					{
						this.state.selectContent.id > 0 && <Tag color="blue">{ this.state.selectContent.title }</Tag>
					}
				</Col>
			</Row>
		)
	}
	setSearch() {
		const customPanelStyle = {
			background: '#f7f7f7',
			borderRadius: 4,
			marginBottom: 24,
			border: 0,
			overflow: 'hidden',
		};
		return (
			<Collapse bordered={false} activeKey={ this.state.panelVisible ? 'def' : '' }>
				<Collapse.Panel header={ this.setTreeSelect() } showArrow={ false } key="def" style={ customPanelStyle } forceRender={ true }>
					<Card bordered={false} style={{height: '350px', overflowY: 'auto'}}>
						<List
							itemLayout="horizontal"
							locale={{ emptyText: '暂无数据' }}
							dataSource={this.state.contentList}
							renderItem={item => {
								const imageUrl = item.imageUrl ? item.imageUrl.split(',')[0] : ''
								return <List.Item>
									<List.Item.Meta
									avatar={<Avatar src={ imageUrl } />}
									title={<a onClick={ () => this.handleSelectContent(item) } href="javascript:" style={{color: item.id === this.state.selectContent.id ? '#1890ff' : ''}}>{item.title}</a>}
									description={
										<div>
											<span style={{ marginRight: '20px' }}>副标题：{item.subTitle || '/'}</span>
											<span style={{ marginRight: '20px' }}>作者：{item.author || '/'}</span>
											<span style={{ marginRight: '20px' }}>权限：{Base.readType[item.readType] || '/'}</span>
										</div>
									}/>
								</List.Item>
							}}/>
					</Card>
					{
						this.state.contentTotal > 0 && <Pagination 
							simple 
							current={ this.state.cpageNo + 1 } 
							pageSize={ this.state.cpageSize } 
							total={ this.state.contentTotal } 
							onChange={ this.handleContentPageNoChange }
							style={{ marginTop: '15px' }}/>
					}
				</Collapse.Panel>
			</Collapse>
		)
	}
	setList() {
		return (
			this.state.commentTotal > 0 && <Table></Table> || <div className="cm-no-data min">暂无数据</div>
		)
	}
	render() {
		return (
			<div className="cm-content">
				{ this.setSearch() }
				{ this.setList() }
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Comment)