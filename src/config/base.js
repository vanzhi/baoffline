/* 静态数据 */
import React from 'react';
import { Icon } from 'antd';

class MenuInfo {
    constructor(props) {
        this.menus = [];
        this.setMenuList();
    }
    setMenuList() {
        this.menus = [{
            key         : 'station',
            name        : '站点管理',
            icon        : () => (<Icon type="environment" />),
            children    : []
        }, {
            key         : 'system',
            name        : '系统管理',
            icon        : () => (<Icon type="tag" />),
            children    : []
        }, {
            key         : 'setting',
            name        : '平台设置',
            icon        : () => (<Icon type="appstore" />),
            children    : []
        }, {
            key         : 'statement',
            name        : '统计分析',
            icon        : () => (<Icon type="pie-chart" />),
            children    : []
        }]
    }
}

export default {
    MenuInfo : new MenuInfo
};