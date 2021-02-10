// 播放模式
import { playMode } from 'config/common/config'
import { loadSearch, loadPlay } from 'config/js/cache'

const state = {
    singer: {},
    playing: false, //播放器默认状态
    fullScreen: false, //播放器是否全屏
    playlist: [], //播放歌曲列表
    sequenceList: [], //播放顺序-有随机-列表-单曲排列
    mode: playMode.sequence, //默认顺序播放
    currentIndex: -1, //当前播放索引
    disc: {}, //歌单
    topList: {}, //榜单歌曲
    searchHistory: loadSearch(), //搜索历史
    playHistory: loadPlay(), //播放历史记录
}

export default state;