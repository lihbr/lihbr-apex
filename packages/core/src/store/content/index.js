export const state = () => ({
  settings: process.env.GLOBAL_CONTENT.settings,
  arts: process.env.GLOBAL_CONTENT.arts,
  currentArt: process.env.GLOBAL_CONTENT.arts[0]
});

export const mutations = {
  setCurrentArt(state, art) {
    state.currentArt = art;
  }
};

export const actions = {
  pageChanged({ dispatch }) {
    dispatch("randomizeArt");
  },
  randomizeArt({ state, commit }) {
    const otherArts = state.arts.filter(
      art =>
        !state.currentArt.picture ||
        art.picture.url !== state.currentArt.picture.url
    );
    commit(
      "setCurrentArt",
      otherArts[Math.floor(Math.random() * otherArts.length)]
    );
  }
};
