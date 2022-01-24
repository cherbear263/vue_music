import NProgress from 'nprogress';

// import router as object because NProgress is 3rd party to Vue
export default (router) => {
  router.beforeEach((to, from, next) => {
    // initialize progress bar
    NProgress.start();
    next();
  });

  router.afterEach(NProgress.done);
  // no next needed for afterEach guard
};
