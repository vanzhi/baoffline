import NProgress from 'nprogress'
import { 
	SET_PATH, 
	SET_STATIONS,
	SET_MENUS,
	SET_CURRENT_STATION,
	SET_LOADING_ON,
	SET_LOADING_OFF,
	SET_NODES,
	SET_INDEX_NODE,
	SET_REQUEST,
	SET_RESPONSE,
	SET_NODE_GROUPS,
	SET_NODE_GROUPS_SORT,
	SET_CONTENT_GROUPS,
	SET_CONTENT_GROUPS_SORT } from './actions'

// 一级一级获取menu进行设置，返回menusByKey为state.menus
function setMenus(menus, menusByKey = {}, prePath = []) {
	if (!menus.length) {
		return menusByKey
	}
	for (let i = 0; i < menus.length; i ++) {
		let { key, name, icon, children } = menus[i]
		let path = [...prePath, key]		// 到当前节点的key轨迹
		menusByKey[key] = {
			key, 
			name, 
			icon, 
			path,
			children: children ? children.map(menu => menu.key) : undefined
		}
		children && setMenus(children, menusByKey, path)
	}
	return menusByKey
}

// 一级一级获取栏目节点
function setNodes(nodes, nodesByKey = {}) {
	for (let i = 0; i < nodes.length; i++) {
		let { childs, nodeId } = nodes[i]
		nodesByKey[nodeId] = {
			...nodes[i],
			children: childs ? childs.map(child => child.nodeId) : undefined
		}
		delete nodesByKey[nodeId].childs
		childs && setNodes(childs, nodesByKey)
	}
	return nodesByKey
}

// 页面载入
export const loading = (state, action) => {
	switch(action.type) {
		case SET_LOADING_ON:
			NProgress.start()
			return true
		case SET_LOADING_OFF: 
			NProgress.done()
			return false
		default:
			return state || false
	}
}

// 关键字菜单对象
export const menus = (state, action) => {
	switch(action.type) {
		case SET_MENUS:
			return setMenus(action.menus)
		default:
			return state || {}
	}
}

// 设置路由轨迹
export const path = (state, action) => {
	switch(action.type) {
		case SET_PATH:
			let reg = /(^\/+)|(\/+$)/g
			let path = action.pathname.replace(reg, '').split('/')
			let last = path[path.length - 1]
			while(last && action.menus[last] && action.menus[last].children) {
				last = action.menus[last].children[0]
				last && path.push(last)
			}
			return path
		default:
			return state || []
	}
}

// 站点列表
export const stations = (state, action) => {
	switch(action.type) {
		case SET_STATIONS:
			let stations = {}
			action.stations.map(st => {
				stations[st.id] = st
				return st.id
			})
			return stations
		default:
			return state || {}
	}
}

// 当前站点
export const currentStationId = (state, action) => {
	switch(action.type) {
		case SET_CURRENT_STATION:
			return action.currentStationId
		default:
			return state || 0
	}
}

// 栏目首页id
export const indexNodeId = (state, action) => {
	switch(action.type) {
		case SET_INDEX_NODE:
			return action.indexNodeId
		default:
			return state || 0
	}
}

// 栏目节点信息
export const nodes = (state, action) => {
	switch(action.type) {
		case SET_NODES:
			let nodes = setNodes(action.nodes)
			return nodes
		default:
			return state || {}
	}
}

// 栏目组信息
export const nodeGroups = (state, action) => {
	switch(action.type) {
		case SET_NODE_GROUPS:
			let groupNodes = {}
			action.nodeGroups.map((item, index) => {
				groupNodes[item.nodeGroupName] = item
				return item
			})
			return groupNodes
		default:
			return state || {}
	}
}

// 栏目组排序
export const nodeGroupsSort = (state, action) => {
	switch(action.type) {
		case SET_NODE_GROUPS_SORT:
			return action.nodeGroups.map((item, index) => {
				return item.nodeGroupName
			})
		default:
			return state || []
	}
}

// 内容组信息
export const contentGroups = (state, action) => {
	switch(action.type) {
		case SET_CONTENT_GROUPS:
			let groupContents = {}
			action.contentGroups.map((item, index) => {
				groupContents[item.id] = item
				return item
			})
			return groupContents
		default:
			return state || {}
	}
}

// 内容组排序
export const contentGroupsSort = (state, action) => {
	switch(action.type) {
		case SET_CONTENT_GROUPS_SORT:
			return action.contentGroups.map((item, index) => {
				return item.id
			})
		default:
			return state || []
	}
}

// 请求
export const fetchStore = (state, action) => {
	let store = { ...state }
	switch(action.type) {
		case SET_REQUEST:
			store[action.apiName] = store[action.apiName] || {}
			store[action.apiName].request = action.request || null
			return store
		case SET_RESPONSE:
			store[action.apiName] = store[action.apiName] || {}
			store[action.apiName].response = action.response || null
			return store
		default:
			return state || {}
	}
}