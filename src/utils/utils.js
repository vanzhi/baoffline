export default {
    firstKeyOf: (obj) => {
        if (obj instanceof Array) {
            return 0
        } else if (typeof obj === 'object') {
            let keys = Object.keys(obj)
            return keys[0]
        }
    },
    each : (obj, callback) => {
        if (!callback) {
            return
        }
        if (obj instanceof Array) {
            return obj.map(callback)
        } else if (typeof obj === 'object') {
            let keys = Object.keys(obj)
            return keys.map((item, index) => {
                return callback(obj[item], item, obj)
            })
        }
    }
}