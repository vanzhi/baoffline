// import fetch from 'isomorphic-fetch';
import axios from 'axios'
import { message } from 'antd'

const POST = 'POST';
const GET = 'GET';
const _host = '139.224.234.251'
const _port = '8080'
const _protocol = ''

function checkUrl(url) {
    let reg = /^((ht|f)tps?):\/\/[\w-]+(\.[\w-]+)+([\w-.,@?^=%&:/~+#]*[\w-@?^=%&/~+#])?$/
    if (reg.test(url)) {
        return url
    }
    let host = _host || window.location.host
    let port = _port || window.location.port
    let protocol = _protocol || window.location.protocol

    return [protocol, '//', host, (port ? (':' + port) : ''), url].join('')
}

function errorCall(error) {
    error && error.data && message.error(error.data.desc)
}

export const fetchRequest = (url, params, method = POST) => {
    // 请求配置
    // let headers = new Headers()
    // headers.append('Content-Type', 'application/json;charset=utf-8')
    // let config = {
    //     headers,
    //     mode: 'cors',
    //     body: method === POST ? JSON.stringify(params) : undefined,
    //     method
    // }
    let requestUrl = checkUrl(url)

    return new Promise((resolve, reject) => {
        // 执行http请求
        // todo - 带cookie
        if (method === POST) {
            axios.post(requestUrl, params)
                .then(success => {
                    if (success.data.code === 1000)
                        resolve(success.data)
                    else 
                        if (reject(success) !== false) {
                            errorCall(success)
                        }
                })
                .catch(error => {
                    if (reject(error) !== false) {
                        errorCall(error)
                    }
                })
        } else {
            axios.get(requestUrl, {params})
                .then(success => {
                    if (success.data.code === 1000)
                        resolve(success.data)
                    else 
                    if (reject(success) !== false) {
                        errorCall(success)
                    }
                })
                .catch(error => {
                    if (reject(error) !== false) {
                        errorCall(error)
                    }
                })
        }

        // fetch(requestUrl, config)
        //     .then(response => {
        //         return response.json()
        //     })
        //     .then(data => {
        //         if (data.code === 1000) {
        //             resolve(data)
        //         } else {
        //             reject()
        //         }
        //     })
    }) 
}

// 上传图片
export const _uploadImage = (param) => {
    return checkUrl(`/cms/resource/img/${param.stationId}/upload`)
}

// 上传视频
export const _uploadVideo = (param) => {
    return checkUrl(`/cms/resource/video/${param.stationId}/upload`)
}

// 上传视频
export const _uploadFile = (param) => {
    return checkUrl(`/cms/resource/file/${param.stationId}/upload`)
}

// 获取站点列表
export const getStationList = (param = {}) => {
    let url = '/cms/domain/list'
    return fetchRequest(url, param, GET)
}

// 新增站点
export const addStation = (param = {}) => {
    let url = '/cms/domain/add'
    return fetchRequest(url, param.data, POST)
}

// 编辑站点
export const updateStation = (param = {}) => {
    let url = '/cms/domain/update'
    return fetchRequest(url, param.data, POST)
}

// 删除站点
export const deleteStation = (param = {stationId: 0}) => {
    let url = `/cms/domain/delete/${param.stationId}`
    return fetchRequest(url, param.data, POST)
}

// 获取栏目列表
export const getNodeList = (param = {stationId:0}) => {
    let url = `/cms/node/${param.stationId}/list`
    return fetchRequest(url, {}, GET)
}

// 分页查询内容
export const getContentList = (param = {stationId:0, nodeId:0}) => {
    let { stationId, nodeId } = param
    let url = `/cms/content/${stationId}/${nodeId}/list`
    return fetchRequest(url, param.data, POST)
}

// 删除栏目
export const deleteNodes = (param = {}) => {
    let url = '/cms/node/delete'
    return fetchRequest(url, param.data, POST)
}

// 获取栏目组信息
export const getNodeGroups = (param = { stationId:0 }) => {
    let url = `/cms/node/group/${param.stationId}/list`
    return fetchRequest(url, {}, GET)
}

// 添加栏目组
export const addNodeGroup =  (param = { stationId:0 }) => {
    let url = `/cms/node/group/${param.stationId}/add`
    param = { ...param }
    delete param.stationId
    return fetchRequest(url, param, POST)
}

// 编辑栏目组-todo-没有接口
export const editNodeGroup = (param = { stationId:0 }) => {
    let url = `/cms/node/group/${param.stationId}/edit`
    param = { ...param }
    delete param.stationId
    return fetchRequest(url, param, POST)
}

// 删除栏目组
export const deleteNodeGroup =  (param = { stationId:0 }) => {
    let url = `/cms/node/group/${param.stationId}/delete`
    param = { ...param }
    delete param.stationId
    return fetchRequest(url, param, POST)
}

// 添加栏目
export const addNode =  (param = { stationId:0 }) => {
    let url = `/cms/node/${param.stationId}/add`
    return fetchRequest(url, param.data, POST)
}

// 编辑栏目
export const updateNode =  (param) => {
    let url = `/cms/node/update`
    return fetchRequest(url, param.data, POST)
}

// 栏目排序
export const sortNode =  (param) => {
    let url = `/cms/node/sort`
    return fetchRequest(url, param.data, POST)
}

// 获取内容组信息
export const getContentGroups = (param = { stationId:0 }) => {
    let url = `/cms/content/group/${param.stationId}/list`
    return fetchRequest(url, {}, GET)
}

// 添加内容组
export const addContentGroup =  (param = {}) => {
    let url = `/cms/content/group/add`
    return fetchRequest(url, param.data, POST)
}

// 编辑内容组-todo-没有接口
export const editContentGroup = (param = {}) => {
    let url = `/cms/content/group/update`
    return fetchRequest(url, param.data, POST)
}

// 删除内容组
export const deleteContentGroup =  (param = {}) => {
    let url = `/cms/content/group/delete`
    return fetchRequest(url, param.data, POST)
}

// 添加内容
export const addContent =  (param = { stationId:0 }) => {
    let url = `/cms/content/${param.stationId}/${param.nodeId}/add`
    return fetchRequest(url, param.data, POST)
}

// 编辑内容
export const updateContent =  (param = {}) => {
    let url = `/cms/content/update`
    return fetchRequest(url, param.data, POST)
}

// 删除内容
export const deleteContent =  (param = {}) => {
    let url = `/cms/content/delete`
    return fetchRequest(url, param.data, POST)
}

// 评论查询
export const getCommentList =  (param = { contentId:0 }) => {
    let url = `/cms/comment/${param.contentId}/list`
    return fetchRequest(url, param.data, POST)
}

// 上传图片
export const uploadImage = (param = {}) => {
    let url = `/cms/resource/img/${param.stationId}/upload`
    param = { ...param }
    delete param.contentId
    return fetchRequest(url, param, POST)
}