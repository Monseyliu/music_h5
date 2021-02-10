
import { mapGetters, mapMutations } from "vuex"
import { playMode } from "config/common/config"
import { shuffle } from "config/js/util";


// 处理mini播放器占高问题
export const playlistMixin = {
    computed: {
        ...mapGetters([
            "sequenceList", "currentSong", "playlist", "mode"
        ]),
    },
    mounted() {
        this.handlePlaylist(this.playlist)
    },
    activated() {
        this.handlePlaylist(this.playlist)
    },
    watch: {
        playlist(newVal) {
            this.handlePlaylist(newVal)
        }
    },
    methods: {
        handlePlaylist() {
            throw new Error('component must implement handlePlaylist method')
        }
    },
}

// 处理动态添加样式 及点击事件
export const playerMixin = {
    computed: {
        iconMode() {
            // 控制 播放模式
            return this.mode === playMode.sequence
                ? "icon-sequence"
                : this.mode === playMode.loop
                    ? "icon-loop"
                    : "icon-random";
        },
    },
    methods: {
        ...mapMutations([
            "SET_PLAYING_STATE",
            "SET_CURRENT_INDEX",
            "SET_PLAY_MODE",
            "SET_PLAYLIST",
        ]),
        changeMode() {
            // 更改播放模式
            const mode = (this.mode + 1) % 3;
            this.SET_PLAY_MODE(mode);
            let list = null;
            if (mode === playMode.random) {
                list = shuffle(this.sequenceList);
            } else {
                list = this.sequenceList;
            }
            this.resetCurrentIndex(list);
            this.SET_PLAYLIST(list);
        },
        resetCurrentIndex(list) {
            // 控制当前歌曲
            let index = list.findIndex((item) => {
                return item.id === this.currentSong.id;
            });
            this.SET_CURRENT_INDEX(index);
        },
    },
}
