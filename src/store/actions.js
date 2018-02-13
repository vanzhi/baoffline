import * as API from '@/fetch'

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
export const SET_STATIONS = 'GET_STATIONS'
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
export const setCurrentStation = (currentStation) => {
	return {
		type : SET_CURRENT_STATION,
		currentStation
	}
}





