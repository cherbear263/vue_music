import { createStore } from 'vuex';
import { auth, usersCollection } from '@/includes/firebase';
import { Howl } from 'howler';

export default createStore({
  state: {
    authModalShow: false,
    userLoggedIn: false,
    currentSong: {},
    sound: {},
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
  },
  getters: {
    // authModalShow: (state) => (state.authModalShow),
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
    async newSong({ commit, state }, payload) {
      commit('newSong', payload);

      state.sound.play();
    },
  },
});
