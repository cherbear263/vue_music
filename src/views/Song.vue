<template>
<main>
  <!-- Music Header -->
  <section class="w-full mb-8 py-14 text-center text-white relative">
    <div class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
      style="background-image: url(/assets/img/song-header.png)">
    </div>
    <div class="container mx-auto flex items-center">
      <!-- Play/Pause Button -->
      <button type="button"
      class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full
        focus:outline-none"
        @click.prevent="newSong(song), toggleAudio">
        <i class="fas" :class="{ 'fa-play': !playing, 'fa-pause': playing }"></i>
      </button>

      <div class="z-50 text-left ml-8">
        <!-- Song Info -->
        <div class="text-3xl font-bold">{{ song.modified_name }}</div>
        <div>{{ song.genre }}</div>
      </div>
    </div>
  </section>
  <!-- Form -->
  <section class="container mx-auto mt-6" id="comments">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <!-- Comment Count -->
        <span class="card-title">
          {{ $tc('song.comment_count', song.comment_count, {
            count: song.comment_count
          }) }}
          </span>
        <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
      </div>
      <div class="p-6">
        <div class="text-white text-center font-bold p-4 mb-4"
        v-if="comment_show_alert" :class="comment_alert_variant">
          {{ comment_alert_msg }}
        </div>
        <vee-form :validation-schema="schema" v-if="userLoggedIn"
        @submit="addComment">
          <vee-field as="textarea" name="comment"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
              duration-500 focus:outline-none focus:border-black rounded mb-4"
            placeholder="Your comment here..."></vee-field>
            <ErrorMessage class="text-red-600" name="comment" />
          <button type="submit" :disabled="comment_in_submission"
            class="py-1.5 px-3 rounded text-white bg-green-600 block">
            Submit
          </button>
        </vee-form>
        <!-- Sort Comments -->
        <select v-model="sort"
          class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition
          duration-500 focus:outline-none focus:border-black rounded">
          <option value="1">Latest</option>
          <option value="2">Oldest</option>
        </select>
      </div>
    </div>
  </section>
  <!-- Comments -->
  <ul class="container mx-auto">
    <li class="p-6 bg-gray-50 border border-gray-200" v-for="comment in sortedComments"
    :key="comment.docID">
      <!-- Comment Author -->
      <div class="mb-5">
        <div class="font-bold">{{ comment.name }}</div>
        <time>{{ comment.datePosted }}</time>
      </div>

      <p>
        {{ comment.content }}
      </p>
    </li>
  </ul>
</main>
</template>

<script>
import { songsCollection, auth, commentsCollection } from '@/includes/firebase';
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  name: 'Song',
  data() {
    return {
      song: {},
      schema: {
        comment: 'required|min:3',
      },
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_variant: 'bg-blue-500',
      comment_alert_msg: 'Submitting your comment. Please wait.',
      comments: [],
      sort: '1', // 1 indicates that the order should be latest to oldest
    };
  },
  computed: {
    ...mapState(['userLoggedIn', 'currentSong']),
    ...mapGetters(['playing']),
    sortedComments() {
      // you can't change the data - create a new array with slice
      return this.comments.slice().sort((a, b) => {
        if (this.sort === '1') {
          return new Date(b.datePosted) - new Date(a.datePosted);
        }
        return new Date(a.datePosted) - new Date(b.datePosted);
      });
    },
  },
  async created() {
    const docSnapshot = await songsCollection.doc(this.$route.params.id).get();

    // song ID is invalid
    if (!docSnapshot.exists) {
      this.$router.push({ name: 'home' });
      return;
    }
    const { sort } = this.$route.query; // chceck to see if there is a query parameter

    this.sort = sort === '1' || sort === '2' ? sort : '1';

    this.song = docSnapshot.data();
    this.getComments();
  },
  methods: {
    ...mapActions(['newSong', 'toggleAudio']),
    async addComment(values, { resetForm }) {
      this.comment_in_submission = true;
      this.comment_show_alert = true;
      this.comment_alert_variant = 'bg-blue-500';
      this.comment_alert_msg = 'Submitting your comment. Please wait.';

      const user = auth.currentUser;
      console.log(user);
      let comment = '';
      if (user !== null) {
        comment = {
          content: values.comment,
          datePosted: new Date().toString(),
          // associate the comment with the song from the url
          sid: this.$route.params.id,
          name: user.displayName,
          uid: user.uid,
        };
      } else {
        console.log('Could not find user data');
        return;
      }

      await commentsCollection.add(comment);

      // update the comment count in comments collection
      this.song.comment_count += 1;
      await songsCollection.doc(this.$route.params.id).update({
        comment_count: this.song.comment_count,
      });

      this.getComments();

      this.comment_in_submission = false;
      this.comment_alert_variant = 'bg-green-500';
      this.comment_alert_msg = 'Comment added!';

      resetForm();
    },
    async getComments() {
      const snapshots = await commentsCollection.where(
        'sid', '==', this.$route.params.id,
      ).get();

      this.comments = [];

      snapshots.forEach((doc) => [
        this.comments.push({
          docID: doc.id,
          ...doc.data(),
        }),
      ]);
    },
  },
  watch: {
    // track changes to sort method. Add query parameter to url
    sort(newVal) {
      // don't change anything if the sort parameter matches the route
      if (newVal === this.$route.query.sort) {
        return;
      }
      this.$router.push({
        query: {
          sort: newVal,
        },
      });
    },
  },
};
</script>
