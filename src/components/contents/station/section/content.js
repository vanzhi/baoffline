import React, { Component } from 'react'
import { Layout, Input, Button, Table, Tree } from 'antd'
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

class Content extends Component {
	state = {
		contentList: []
	}
	pageNo = 0
	pageSize = 10
	selectTreeNodeHandler = (selectedKeys, e) => {
		this.loadList(selectedKeys[0] * 1, this.props.currentStationId, this.pageNo, this.pageSize)
	}
	loadList(nodeId, stationId, pageNo, pageSize) {
		API.getContentList({ nodeId, stationId, pageNo, pageSize })
			.then(success => {
				this.setState({
					contentList : success.data.data
				})
			})
			.catch(error => {

			})
	}
	componentDidMount() {
		
	}
	componentWillReceiveProps() {
		
	}
	getTreeNodes(pNodeId) {
		if (!pNodeId) return
		let node = this.props.nodes[pNodeId]
		return <TreeNode 
					title={ node.nodeName } 
					key={ pNodeId } 
					selectable={ !node.children || !node.children.length }>
					{ node.children && node.children.map(nodeId => this.getTreeNodes(nodeId)) }
				</TreeNode>
	}
	setSearch() {
		return (
			<div>
				<Input.Search
					placeholder="按标题搜索"
					onSearch={value => console.log(value)} />
			</div>
		)
	}
	setOption() {
		return (
			<div className="cm-option">
				<Button type="primary" icon="plus">添加内容</Button>
				<Button type="danger">删除</Button>
			</div>
		)
	}
	setList() {
		let columns = [{
			title: '标题',
  			dataIndex: 'title'
		}, {
			title: '添加日期',
  			dataIndex: 'addDate'
		}, {
			title: '点击量',
		}, {
			title: '状态',
		}]
		return <Table columns={ columns } dataSource={ this.state.contentList } rowKey="id"/>
	}
	setNoData () {
		return <div className="cm-no-data">暂无数据</div>
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
									defaultExpandedKeys={ [dfId] }
									onSelect={ this.selectTreeNodeHandler }>
									{ this.getTreeNodes(indexNode.nodeId) }
								</Tree>
							)
						}
					</div>
				</Layout.Sider>
				<Layout.Content className="fn-bg-white cm-content">
					{ this.setSearch() }
					{ this.setOption() }
					{ this.state.contentList.length ? this.setList() : this.setNoData() }
				</Layout.Content>
			</Layout>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Content)