import { createStore, combineReducers, applyMiddleware } from 'redux'
import Thunk from 'redux-thunk'
import * as reducers from './reducers'
import * as actions from './actions'
import Base from '@/config/base'

const reducer = combineReducers(reducers)
const store = createStore(reducer, applyMiddleware(Thunk))

// 获取基础信息
store.dispatch(actions.getStations())
// 按关键字设置菜单
store.dispatch(actions.setMenus(Base.MenuInfo.menus))
// 查看store信息
store.subscribe(() => {
    console.log(store.getState())
})
// debug
store.dispatch(actions.setCurrentStation(1))

export default store