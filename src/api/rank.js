import jsonp from '../config/js/jsonp'
import { commonParams, options } from './config'

// 获取排行榜
export function getTopList() {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg';

    const data = Object.assign({}, commonParams, {
        platform: 'h5',
        needNewCode: 1
    })

    return jsonp(url, data, options);
}

// 榜单歌曲获取
export function getMusicList(topid) {
    const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';

    const data = Object.assign({}, commonParams, {
        topid,
        page: 'detail',
        type: 'top',
        tpl: 3,
        platform: 'h5',
        needNewCode: 1
    })

    return jsonp(url, data, options)
}