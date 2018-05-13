/* 静态数据 */
import React from 'react';
import { Icon } from 'antd';

class MenuInfo {
    constructor(props) {
        this.menus = [];
        this.setMenuList();
    }
    setMenuList() {
        // 菜单对象
        this.menus = [{
            key         : 'station',
            name        : '站点管理',
            icon        : <Icon type="environment" />,
            children    : [{
                key         : 'section',
                name        : '信息管理',
                icon        : <Icon type="database" />,
                children    : [{
                    key         : 'content',
                    name        : '内容管理'
                }, {
                    key         : 'menu',
                    name        : '栏目管理'
                }, {
                    key         : 'contentGroup',
                    name        : '内容组管理'
                }, {
                    key         : 'menuGroup',
                    name        : '栏目组管理'
                }, {
                    key         : 'transfer',
                    name        : '批量转移'
                }, {
                    key         : 'audit',
                    name        : '内容审核'
                }, {
                    key         : 'comment',
                    name        : '评论管理'
                }, {
                    key         : 'deleted',
                    name        : '内容回收站'
                }, {
                    key         : 'push',
                    name        : '推送管理'
                }]
            }, {
                key         : 'action',
                name        : '功能管理',
                icon        : <Icon type="database" />,
                children    : []
            }]
        }, {
            key         : 'system',
            name        : '系统管理',
            icon        : <Icon type="tag" />,
            children    : [{
                key         : 'site',
                name        : '站点管理',
                icon        : <Icon type="database" />,
                children    : [{
                    key         : 'foundation',
                    name        : '站点管理'
                }]
            }]
        }, {
            key         : 'setting',
            name        : '平台设置',
            icon        : <Icon type="appstore" />,
            children    : []
        }, {
            key         : 'statement',
            name        : '统计分析',
            icon        : <Icon type="pie-chart" />,
            children    : []
        }]
    }
}

// 内容权限
const readType = {
    0: '公开',
    1: '内网'
}

const contentMode = {
    'Content': '内容',
    'Image': '图片',
    'Vote': '投票',
    'Recruit': '招聘'
}

const linkType = {
    'LinkNoRelatedToChannelAndContent' : '默认（列表）',
    'LinkToFirstContent' : '链接到第一条内容',
    'LinkToFirstChannel' : '链接到第一个子栏目',
    'LinkToLastAddChannel' : '链接到最近添加的子栏目'
}

const nodeType = {
    'BackgroundTopicNode' : '专题',
    'BackgroundNormalNode' : '普通'
}

export default {
    MenuInfo : new MenuInfo(),
    contentMode,
    linkType,
    nodeType,
    readType
}