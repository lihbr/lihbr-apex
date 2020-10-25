export const state = () => ({
  loaded: false,
  inited: false
});

export const mutations = {
  isLoaded(state) {
    state.loaded = true;
  },
  isInited(state) {
    state.inited = true;
  }
};

export const actions = {
  nuxtServerInit({ dispatch }) {
    dispatch("load");
    console.info("Nuxt server init content loaded");
  },
  load({ state, commit, dispatch }) {
    if (state.loaded) return;

    // Actions performed when generating application
    // dispatch("something");

    // Load finished
    commit("isLoaded");
  },
  init({ state, commit, dispatch }) {
    if (!state.loaded) dispatch("load");
    if (state.inited) return;

    // Actions performed on application mount
    dispatch("theme/init");

    // Init finished
    commit("isInited");
  },
  pageChanged({ state, dispatch }, ignore = []) {
    if (!state.inited) dispatch("init");

    // Actions performed on page change
    const modules = ["content", "theme"].filter(mod => !ignore.includes(mod));
    modules.forEach(mod => dispatch(`${mod}/pageChanged`));
  }
};
