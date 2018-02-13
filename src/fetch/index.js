import fetch from 'isomorphic-fetch';

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
    let headers = new Headers()
    let config = {

        headers,
        method
    };
    let requestUrl = checkUrl(url)

    return new Promise((resolve, reject) => {
        // 执行http请求
        // todo - 带cookie
        fetch(requestUrl, config)
            .then(response => {
                return response.json()
            })
            .then(data => {
                if (data.code === 1000) {
                    resolve(data)
                } else {
                    reject()
                }
            })
    }) 
}

export const getStationList = (param = {}) => {
    let url = '/cms/domain/list'
    return fetchRequest(url, param, GET)
}

