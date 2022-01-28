import { shallowMount } from '@vue/test-utils';
import Home from '@/views/Home.vue';
import SongItem from '@/components/SongItem.vue';

// mock firebase
jest.mock('@/includes/firebase', () => {

});
describe('Home.vue', () => {
  test('renders list of songs', () => {
    const songs = [
      {}, {}, {},
    ];
    // override the get songs method from home.
    Home.methods.getSongs = () => false;

    const component = shallowMount(Home, {
      data() {
        return {
          songs,
        };
      },
      // mock the global function $t from i18n
      global: {
        mocks: {
          $t: (message) => message,
        },

      },
    });
    const items = component.findAllComponents(SongItem);

    expect(items).toHaveLength(songs.length);

    // check to see if the items are in the right order
    items.forEach((wrapper, i) => {
      expect(wrapper.props().song).toStrictEqual(songs[i]);
    });
  });
});
