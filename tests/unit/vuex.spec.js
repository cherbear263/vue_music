import { createStore } from 'vuex';
import auth from '@/store/modules/auth';
import { cloneDeep } from 'lodash';

// mock firebase
jest.mock('@/includes/firebase', () => ({
  auth: {
    signInWithEmailAndPassword: () => Promise.resolve(),
  },
}));
describe('Vuex Store', () => {
  test('toggleAuth mutation sets userLoggedIn to true', () => {
    // prevent leaking issues by cloning the store
    const clonedAuth = cloneDeep(auth);

    const store = createStore({
      modules: {
        auth: clonedAuth,
      },
    });
    expect(store.state.auth.userLoggedIn).not.toBe(true);
    store.commit('toggleAuth');
    expect(store.state.auth.userLoggedIn).toBe(true);
  });
  test('login action sets userLoggedIn to true', async () => {
    // tell jest how  many assertions we will make (since it is returning a promise)
    expect.assertions(2);
    const clonedAuth = cloneDeep(auth);

    const store = createStore({
      modules: {
        auth: clonedAuth,
      },
    });

    expect(store.state.auth.userLoggedIn).toBe(false);
    // log in
    await store.dispatch('login', { email: '', password: '' });
    expect(store.state.auth.userLoggedIn).toBe(true);
  });
});
