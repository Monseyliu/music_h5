import state from "./state";

// 映射设置歌手
export const singer = state => state.singer;
// 映射 播放器参数
export const playing = state => state.playing;
export const fullScreen = state => state.fullScreen;
export const playlist = state => state.playlist;
export const sequenceList = state => state.sequenceList;
export const mode = state => state.mode;
export const currentIndex = state => state.currentIndex;
// 当前播放歌曲
export const currentSong = (state) => {
    return state.playlist[state.currentIndex] || {};
}
// 歌单
export const disc = state => state.disc;
export const topList = state => state.topList;