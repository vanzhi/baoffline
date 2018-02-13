import React, { Component } from 'react';
import { Tree } from 'antd';
import { Layout } from 'antd';

const TreeNode = Tree.TreeNode

class ContentGroup extends Component {
	render() {
		return (
			<Layout.Sider className="fn-bg-grey">
				<div>
					<h3>首页</h3>
					<Tree>
						<TreeNode title="test"></TreeNode>
					</Tree>
				</div>
			</Layout.Sider>
		)
	}
}

export default ContentGroup