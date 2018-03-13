// import fetch from 'isomorphic-fetch';
import axios from 'axios'

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
                        reject(success)
                })
                .catch(error => {
                    reject(error)
                })
        } else {
            axios.get(requestUrl, {params})
                .then(success => {
                    if (success.data.code === 1000)
                        resolve(success.data)
                    else 
                        reject(success)
                })
                .catch(error => {
                    reject(error)
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
    return checkUrl(`/cms/img/${param.stationId}/upload`)
}

// 获取站点列表
export const getStationList = (param = {}) => {
    let url = '/cms/domain/list'
    return fetchRequest(url, param, GET)
}

// 获取栏目列表
export const getNodeList = (param = {stationId:0}) => {
    let url = `/cms/node/${param.stationId}/list`
    return fetchRequest(url, {}, GET)
}

// 分页查询内容
export const getContentList = (param = {stationId:0, nodeId:0}) => {
    let { stationId, nodeId, pageNo, pageSize } = param
    let url = `/cms/content/${stationId}/${nodeId}/list`
    return fetchRequest(url, {pageNo, pageSize}, POST)
}

// 删除栏目
export const deleteNodes = (param = {}) => {
    let url = '/cms/node/delete'
    return fetchRequest(url, param, POST)
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

// 获取内容组信息
export const getContentGroups = (param = { stationId:0 }) => {
    let url = `/cms/content/group/${param.stationId}/list`
    return fetchRequest(url, {}, GET)
}

// 添加内容组
export const addContentGroup =  (param = { stationId:0 }) => {
    let url = `/cms/content/group/${param.stationId}/add`
    param = { ...param }
    delete param.stationId
    return fetchRequest(url, param, POST)
}

// 编辑内容组-todo-没有接口
export const editContentGroup = (param = { stationId:0 }) => {
    let url = `/cms/content/group/${param.stationId}/edit`
    param = { ...param }
    delete param.stationId
    return fetchRequest(url, param, POST)
}

// 删除内容组
export const deleteContentGroup =  (param = { stationId:0 }) => {
    let url = `/cms/content/group/${param.stationId}/delete`
    param = { ...param }
    delete param.stationId
    return fetchRequest(url, param, POST)
}

// 评论查询
export const getCommentList =  (param = { contentId:0 }) => {
    let url = `/cms/comment/${param.contentId}/list`
    param = { ...param }
    delete param.contentId
    return fetchRequest(url, param, POST)
}