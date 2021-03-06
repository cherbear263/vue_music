import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

// load the view dynamically (when needed)
const Home = () => import('@/views/Home.vue');
const About = () => import('@/views/About.vue');
const Manage = () => import(/* webpackChunkName: "groupedChunk" */'@/views/Manage.vue');
const Song = () => import(/* webpackChunkName: "groupedChunk" */'@/views/Song.vue');

const routes = [
  {
    name: 'home',
    path: '/',
    component: Home,
  },
  {
    name: 'about',
    path: '/about',
    component: About,
  },
  {
    name: 'manage',
    // alias is like a redirect, but the url appears to still be 'manage'
    // it is better for search engines to use the other method (redirect)
    // alias: '/manage',
    path: '/manage-music',
    component: Manage,
    meta: {
      requiresAuth: true,
    },
  },
  {
    // by adding a redirect we don't have to worry about
    // users who have bookmarked the old url
    path: '/manage',
    redirect: { name: 'manage' },
  },
  {
    name: 'song',
    path: '/song/:id',
    component: Song,
  },
  {
    // catchall will be checked last so that real routes are prioritized
    // this would be a good place to redirect to 404
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500',
});

router.beforeEach((to, from, next) => {
  // matched references a list of paths the user is visiting
  // you can use this to see if
  // no need to go any further if the path does not require auth
  if (!to.matched.some((record) => record.meta.requiresAuth)) {
    next();
    return;
  }
  if (store.state.auth.userLoggedIn) {
    next();
  // if auth required, and user not logged in redirect to home
  } else {
    next({ name: 'home' });
  }
});

export default router;
