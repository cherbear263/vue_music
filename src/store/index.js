import { createStore } from 'vuex';
import { auth, usersCollection } from '@/includes/firebase';
import { Howl } from 'howler';
import helper from '@/includes/helper';

export default createStore({
  state: {
    authModalShow: false,
    userLoggedIn: false,
    currentSong: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0%',
  },
  mutations: {
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow;
    },
    toggleAuth(state) {
      state.userLoggedIn = !state.userLoggedIn;
    },
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
  },
  actions: {
    async register({ commit }, payload) {
      const userCred = await auth.createUserWithEmailAndPassword(
        payload.email, payload.password,
      );

      // this will retrieve the userCredentials object from firebase
      // we can then use the uid from the auth object as the id
      // in the user doc
      await usersCollection.doc(userCred.user.uid).set({
        name: payload.name,
        email: payload.email,
        age: payload.age,
        country: payload.country,
        genre: payload.genres,

      });

      await userCred.user.updateProfile({
        displayName: payload.name,
      });

      commit('toggleAuth');
    },
    async login({ commit }, payload) {
      // send request to firebase
      await auth.signInWithEmailAndPassword(payload.email, payload.password);
      // if successful commit mutation to log user in state
      commit('toggleAuth');
    },
    init_login({ commit }) {
      // retrieve authentication status
      const user = auth.currentUser;
      // if the user is logged in, save the token to indexed DB local storage
      if (user) {
        commit('toggleAuth');
      }
    },
    async signout({ commit }) {
      await auth.signOut();

      commit('toggleAuth');
    },
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
  },
});
