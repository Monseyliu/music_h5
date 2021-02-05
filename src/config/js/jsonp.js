// 封装jsonpPromise请求
import originJSONP from 'jsonp'

export default function jsonp(url, data, option) {
   
    url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
    
    return new Promise((resolve, reject) => {
        originJSONP(url, option, (err, data) => {
            if (!err) {
                resolve(data)
            } else {
                reject(err)
            }
        })
    })
}
// 拼接函数-将data拼接到URL里
function param(data) {
    let url = '';
    for (var k in data) {
        // 判断是否有值，没有则传 空-不能传undefined
        let value = data[k] !== undefined ? data[k] : '';
        url += `&${k}=${encodeURIComponent(value)}`
    }
    return url ? url.substring(1) : '';
}