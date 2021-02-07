
// 打乱数组排序
export function shuffle(arr) {
    let _arr = arr.slice();
    for (let i = 0; i < _arr.length; i++) {
        let j = gerRandomInt(0, i);
        let t = _arr[i];
        _arr[i] = _arr[j]
        _arr[j] = t;
    }
    return _arr;
}
// 获取随机数
function gerRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}