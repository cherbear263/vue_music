import { Howl } from 'howler';
import helper from '@/includes/helper';

export default {
  state: {
    currentSong: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0%',
  },
  mutations: {
    newSong(state, payload) {
      state.currentSong = payload;
      state.sound = new Howl({
        src: [payload.url], // contains the url to the audio file
        html5: true, // will select the html5 api
      });
    },
    updatePosition(state) {
      state.seek = helper.formatTime(state.sound.seek());
      state.duration = helper.formatTime(state.sound.duration());
      state.playerProgress = `${(state.sound.seek() / state.sound.duration()) * 100}%`;
    },
  },
  getters: {
    // authModalShow: (state) => (state.authModalShow),
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing();
      }

      return false;
    },
    songID: (state) => {
      if (state.sound.playing) {
        return state.currentSong.uid;
      }
      return 'noID';
    },
  },
  actions: {
    async newSong({ commit, state, dispatch }, payload) {
      if (state.sound instanceof Howl) {
        state.sound.unload(); // pause current audio. remove it from memory
      }
      commit('newSong', payload);

      state.sound.play();
      state.sound.on('play', () => {
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      });
    },
    async toggleAudio({ state }) {
      // check to see if the Howl object exists
      if (!state.sound.playing) {
        return;
      }
      // check to see if the audio is playing right now
      if (state.sound.playing()) {
        state.sound.pause();
      } else {
        state.sound.play();
      }
    },
    progress({ commit, state, dispatch }) {
      commit('updatePosition');

      if (state.sound.playing()) {
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      }
    },
    updateSeek({ state, dispatch }, payload) {
      if (!state.sound.playing) {
        return;
      }
      const { x, width } = payload.currentTarget.getBoundingClientRect();
      // Document = 2000, Timeline = 1000, Click = 1000
      const clickX = payload.clientX - x;
      const percentage = clickX / width;
      const seconds = state.sound.duration() * percentage;

      state.sound.seek(seconds);

      state.sound.once('seek', () => {
        dispatch('progress');
      });
    },
  },
};
