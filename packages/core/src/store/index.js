export const state = () => ({
  inited: false
});

export const mutations = {
  isInited(state) {
    state.inited = true;
  }
};

export const actions = {
  init({ state, commit, dispatch }) {
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
