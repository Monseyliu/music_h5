import * as types from './mutation-types'
import { playMode } from 'config/common/config'
import { shuffle } from '../config/js/util';
import { saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite } from 'config/js/cache'

// 点击设置播放
export const selectPlay = function ({ commit, state }, { list, index }) {
    commit(types.SET_SEQUENCE_LIST, list);
    if (state.mode === playMode.random) {
        let randomList = shuffle(list);
        commit(types.SET_PLAYLIST, randomList);
        index = findIndex(randomList, list[index]);
    } else {
        commit(types.SET_PLAYLIST, list);
    }
    commit(types.SET_CURRENT_INDEX, index);
    commit(types.SET_FULL_SCREEN, true);
    commit(types.SET_PLAYING_STATE, true);
}
// 随机播放
export const randomPlay = function ({ commit }, { list }) {
    commit(types.SET_PLAY_MODE, playMode.random);
    commit(types.SET_SEQUENCE_LIST, list);
    let randomList = shuffle(list);
    commit(types.SET_PLAYLIST, randomList);
    commit(types.SET_CURRENT_INDEX, 0);
    commit(types.SET_FULL_SCREEN, true);
    commit(types.SET_PLAYING_STATE, true);
}

// 随机播放的时候找到index
function findIndex(list, song) {
    return list.findIndex(item => {
        return item.id === song.id;
    })
}

// 搜索页面插入歌曲到播放列表
export const insertSong = function ({ commit, state }, song) {
    let playlist = state.playlist.slice();
    let sequenceList = state.sequenceList.slice();
    let currentIndex = state.currentIndex;
    // 记录当前歌曲
    let currentSong = playlist[currentIndex];
    // 查找当前列表中是否有待插入的歌曲，并返回索引
    let fpIndex = findIndex(playlist, song);
    // 插入的歌曲索引+1
    currentIndex++;
    // 插入这首歌到当前索引位置
    playlist.splice(currentIndex, 0, song);
    // 如果已经包含，
    if (fpIndex > -1) {
        // 如果当前插入的序号大于列表中的序号
        if (currentIndex > fpIndex) {
            playlist.splice(fpIndex, 1);
            currentIndex--;
        } else {
            playlist.splice(fpIndex + 1, 1);
        }
    }
    // sequenceList
    let currentSIndex = findIndex(sequenceList, currentSong) + 1;
    let fsIndex = findIndex(sequenceList, song);

    sequenceList.splice(currentSIndex, 0, song);
    if (fsIndex > -1) {
        if (currentSIndex > fsIndex) {
            sequenceList.splice(fsIndex, 1)
        } else {
            sequenceList.splice(fsIndex + 1, 1);
        }
    }
    // 提交修改
    commit(types.SET_PLAYLIST, playlist);
    commit(types.SET_SEQUENCE_LIST, sequenceList);
    commit(types.SET_CURRENT_INDEX, currentIndex);
    commit(types.SET_FULL_SCREEN, true);
    commit(types.SET_PLAYING_STATE, true);
}

// 保存搜索历史
export const saveSearchHistory = function ({ commit }, query) {
    commit(types.SET_SEARCH_HISTORY, saveSearch(query));
}

// 删除单个搜索历史
export const deleteSearchHistory = function ({ commit }, query) {
    commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

// 清空搜索历史
export const clearSearchHistory = function ({ commit }) {
    commit(types.SET_SEARCH_HISTORY, clearSearch());
}

// 删除播放列表中的单首歌曲
export const deleteSong = function ({ commit, state }, song) {
    let playlist = state.playlist.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex
    let pIndex = findIndex(playlist, song)
    playlist.splice(pIndex, 1)
    let sIndex = findIndex(sequenceList, song)
    sequenceList.splice(sIndex, 1)
    if (currentIndex > pIndex || currentIndex === playlist.length) {
        currentIndex--
    }

    commit(types.SET_PLAYLIST, playlist)
    commit(types.SET_SEQUENCE_LIST, sequenceList)
    commit(types.SET_CURRENT_INDEX, currentIndex)

    const playingState = playlist.length > 0;
    commit(types.SET_PLAYING_STATE, playingState);
}

// 清空播放列表
export const deleteSongList = function ({ commit }) {
    commit(types.SET_PLAYLIST, []);
    commit(types.SET_SEQUENCE_LIST, []);
    commit(types.SET_CURRENT_INDEX, -1);
    commit(types.SET_PLAYING_STATE, false);
}

// 保存播放历史
export const savePlayHistory = function ({ commit }, song) {
    commit(types.SET_PLAY_HISTORY, savePlay(song));
}

// 添加收藏列表
export const saveFavoriteList = function ({ commit }, song) {
    commit(types.SET_FAVORITE_LIST, saveFavorite(song));
}
// 移除收藏列表
export const deleteFavoriteList = function ({ commit }, song) {
    commit(types.SET_FAVORITE_LIST, deleteFavorite(song));
}
