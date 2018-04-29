import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Input, Form, TreeSelect, Row, Col } from 'antd'
// import * as Actions from '@/store/actions'
// import * as API from '@/fetch/index'
// import { width } from 'window-size';

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
	confition = {
		selectNodeId: 0,
		keyWords: ''
	}
	state = {
		
	}
	handleSelectTreeChange = (v, vs, { triggerNode }) => {
		let nodeId = triggerNode.props.eventKey * 1
		this.confition.selectNodeId = nodeId
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
	setSearch() {
		let indexNode = this.props.indexNode
		return (
			<Row gutter={ 20 }>
				<Col span={ 6 }>
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
				<Col span={ 6 }>
					<Input.Search 
						placeholder="评论关键字"
						style={{ width: '100%' }}
						enterButton/>
				</Col>
			</Row>
		)
	}
	setOption() {
		
	}
	render() {
		return (
			<div className="cm-content">
				{ this.setSearch() }
				{ this.setOption() }
			</div>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Comment)