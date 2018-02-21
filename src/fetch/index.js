// import fetch from 'isomorphic-fetch';
import axios from 'axios'

const POST = 'POST';
const GET = 'GET';
const _host = '47.92.77.182'
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