import * as API from '@/fetch'

// 页面开始/完成载入
export const SET_LOADING_ON = 'SET_LOADING_ON'
export const SET_LOADING_OFF = 'SET_LOADING_OFF'
export const setLoadingOn = () => {
	return {
		type : SET_LOADING_ON
	}
}
export const setLoadingOff = () => {
	return {
		type : SET_LOADING_OFF
	}
}

// 设置菜单路径
export const SET_PATH = 'SET_PATH'
export const setPath = (location, menus) => {
	return {
		type : SET_PATH,
		pathname: location.pathname,
		menus
	}
}

// 设置站点信息
export const SET_STATIONS = 'SET_STATIONS'
export const setStations = (stations) => {
	return {
		type : SET_STATIONS,
		stations
	}
}
// 获取异步站点信息
export const getStations = () => {
	return dispatch => {
		API.getStationList()
			.then(success => {
				dispatch(setStations(success.data))
			})
	}
}

// 设置菜单按关键字排列 此处menus为数组
export const SET_MENUS = 'SET_MENUS';
export const setMenus = (menus) => {
	return {
		type : SET_MENUS,
		menus
	}
}

// 设置当前站点
export const SET_CURRENT_STATION = 'SET_CURRENT_STATION';
export const setCurrentStation = (currentStationId) => {
	return dispatch => {
		dispatch(getNodes(currentStationId))
		dispatch({
			type : SET_CURRENT_STATION,
			currentStationId
		})
	}
}

// 设置栏目信息
export const SET_NODES = 'SET_NODES'
export const SET_INDEX_NODE = 'SET_INDEX_NODE'
export const setNodes = (nodes) => {
	return {
		type : SET_NODES,
		nodes
	}
}
// 设置入口栏目id
export const setIndexNode = (nodeId) => {
	return {
		type : SET_INDEX_NODE,
		indexNodeId : nodeId
	}
}
// 异步获取栏目信息
export const getNodes = (stationId) => {
	return dispatch => {
		API.getNodeList({stationId})
			.then(success => {
				dispatch(setNodes(success.data))
				dispatch(setIndexNode(success.data[0].nodeId))
			})
	}
}

// 异步获取数据
export const SET_REQUEST = 'SET_REQUEST'
export const SET_RESPONSE = 'SET_RESPONSE'
export const setRequest = (request, apiName) => {
	return {
		type: SET_REQUEST,
		request,
		apiName
	}
}
export const setResponse = (success, response, apiName) => {
	return {
		type: SET_RESPONSE,
		success,
		response,
		apiName
	}
}
export const getFetch = (apiName, requestParam) => {
	return dispatch => {
		dispatch(setRequest(requestParam, apiName))
		API[apiName](requestParam)
			.then(success => {
				dispatch(setResponse(true, success.data, apiName))
			})
			.catch(error => {
				dispatch(setResponse(false, error, apiName))
			})
	}
}
