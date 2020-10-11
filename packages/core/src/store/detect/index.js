import BrowserDetector from "~/assets/js/BrowserDetector";

export const state = () => ({
  browser: "",
  mobile: false,
  touch: false
});

export const mutations = {
  setBrowser(state, browser) {
    state.browser = `is${browser[0].toUpperCase() + browser.slice(1)}`;
  },
  isMobile(state) {
    state.mobile = true;
  },
  isTouch(state) {
    state.touch = true;
  }
};

export const actions = {
  detect({ commit }) {
    const isMobile = require("is-mobile");

    // Browser?
    const browserDetection = new BrowserDetector();
    commit("setBrowser", browserDetection.browser);

    // Mobile?
    if (isMobile()) {
      commit("isMobile");
    }

    // Touch?
    window.addEventListener(
      "touchstart",
      function onFirstTouch(e) {
        e.stopPropagation();
        commit("isTouch");
        window.removeEventListener("touchstart", onFirstTouch, false);
      },
      false
    );
  }
};
