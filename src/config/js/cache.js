// good-storage@1.1.1 库
import storage from "good-storage";

const SEARCH_KEY = '_search_';
const SEARCH_MAX_LENGTH = 15;

const PLAY_KEY = '_play_';
const PLAY_MAX_LENGTH = 200;

// 存储搜索历史等数据到 本地
export function saveSearch(query) {
    let searches = storage.get(SEARCH_KEY, []);

    insertArray(searches, query, (item) => {
        return item === query;
    }, SEARCH_MAX_LENGTH)

    storage.set(SEARCH_KEY, searches);
    return searches;
}

// 数据插入方法
function insertArray(arr, val, compare, maxLen) {
    const index = arr.findIndex(compare);

    if (index === 0) return;
    if (index > 0) {
        arr.splice(index, 1);
    }
    arr.unshift(val);

    if (maxLen && arr.length > maxLen) {
        arr.pop();
    }
}

// 数据删除方法
function deleteFromArray(arr, compare) {
    const index = arr.findIndex(compare)
    if (index > -1) {
        arr.splice(index, 1)
    }
}

// 读取本地数据，供state里面的历史使用
export function loadSearch() {
    return storage.get(SEARCH_KEY, [])
}

// 移除本地搜索数据
export function deleteSearch(query) {
    let searches = storage.get(SEARCH_KEY, [])
    deleteFromArray(searches, (item) => {
        return item === query
    })
    storage.set(SEARCH_KEY, searches)
    return searches
}

// 清空本地搜索数据
export function clearSearch() {
    storage.remove(SEARCH_KEY);
    return [];
}

// 存储播放历史
export function savePlay(song) {
    let songs = storage.get(PLAY_KEY, []);
    insertArray(songs, song, (item) => {
        return item.id === song.id
    }, PLAY_MAX_LENGTH);

    storage.set(PLAY_KEY, songs);

    return songs;
}
// 读取播放历史
export function loadPlay(){
    return storage.get(PLAY_KEY, []);
}