import { createStore } from 'vuex';
import auth from '@/store/modules/auth';

// mock firebase
jest.mock('@/includes/firebase', () => {

});
describe('Vuex Store', () => {
  test('toggleAuth mutation sets userLoggedIn to true', () => {
    const store = createStore({
      modules: {
        auth,
      },
    });
    expect(store.state.auth.userLoggedIn).not.toBe(true);
    store.commit('toggleAuth');
    expect(store.state.auth.userLoggedIn).toBe(true);
  });
});
