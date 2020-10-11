const setScrollRestoration = value => {
  try {
    window.history.scrollRestoration = value;
  } catch (e) {}
};

if (process.client) {
  if ("scrollRestoration" in window.history) {
    setScrollRestoration("manual");

    // reset scrollRestoration to auto when leaving page, allowing page reload
    // and back-navigation from other pages to use the browser to restore the
    // scrolling position.
    window.addEventListener("beforeunload", () => {
      setScrollRestoration("auto");
    });

    // Setting scrollRestoration to manual again when returning to this page.
    window.addEventListener("load", () => {
      setScrollRestoration("manual");
    });
  }
}

export default function (to, from, savedPosition) {
  // Default to top
  let position = { x: 0, y: 0 };

  // savedPosition is only available for popstate navigations (back button)
  if (savedPosition) {
    position = savedPosition;
  }

  const nuxt = window.<%= globals.nuxt %>;

  if (
    // Route hash changes
    (to.path === from.path && to.hash !== from.hash) ||
    // Initial load (vuejs/vue-router#3199)
    to === from
  ) {
    nuxt.$nextTick(() => nuxt.$emit("triggerScroll"));
  }

  return new Promise(resolve => {
    // wait for the out transition to complete (if necessary)
    nuxt.$once("triggerScroll", () => {
      // coords will be used if no selector is provided,
      // or if the selector didn't match any element.
      if (to.hash) {
        let hash = to.hash;
        // CSS.escape() is not supported with IE and Edge.
        if (
          typeof window.CSS !== "undefined" &&
          typeof window.CSS.escape !== "undefined"
        ) {
          hash = "#" + window.CSS.escape(hash.substr(1));
        }
        try {
          const anchor = document.querySelector(hash);
          if (anchor) {
            // scroll to anchor by returning the selector
            position = { selector: hash };
            // apply offset
            if (anchor.dataset.scrollMarginTop) {
              position.offset = {
                x: 0,
                y: Number(anchor.dataset.scrollMarginTop)
              };
            }
          }
        } catch (e) {
          console.warn(
            "Failed to save scroll position. Please add CSS.escape() polyfill (https://github.com/mathiasbynens/CSS.escape)."
          );
        }
      }
      resolve(position);
    });
  });
}
