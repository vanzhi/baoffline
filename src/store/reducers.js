import { 
	SET_PATH, 
	SET_STATIONS,
	SET_MENUS,
	SET_CURRENT_STATION } from './actions';

// 一级一级获取menu进行设置，返回menusByKey为state.menus
function setMenus(menus, menusByKey = {}, prePath = []) {
	if (!menus.length) {
		return menusByKey;
	}
	for (let i = 0; i < menus.length; i ++) {
		let { key, name, icon, children } = menus[i];
		let path = [...prePath, key];		// 到当前节点的key轨迹
		menusByKey[key] = {
			key, 
			name, 
			icon, 
			path,
			children: children ? children.map(menu => menu.key) : undefined
		};
		children && setMenus(children, menusByKey, path);
	}
	return menusByKey;
}

// 关键字菜单对象
export const menus = (state, action) => {
	switch(action.type) {
		case SET_MENUS:
			return setMenus(action.menus);
		default:
			return state || {};
	}
}

// 设置路由轨迹
export const path = (state, action) => {
	switch(action.type) {
		case SET_PATH:
			let reg = /(^\/+)|(\/+$)/g;
			let path = action.pathname.replace(reg, '').split('/');
			let last = path[path.length - 1];
			while(last && action.menus[last] && action.menus[last].children) {
				last = action.menus[last].children[0];
				last && path.push(last);
			}
			return path;
		default:
			return state || [];
	}
}

// 站点列表
export const stations = (state, action) => {
	switch(action.type) {
		case SET_STATIONS:
			let stations = {};
			let stationSorts = action.stations.map(st => {
				stations[st.id] = st;
				return st.id;
			})
			return stations;
		default:
			return state || {};
	}
}

// 当前站点
export const currentStation = (state, action) => {
	switch(action.type) {
		case SET_CURRENT_STATION:
			return action.currentStation;
		default:
			return state || 0;
	}
}