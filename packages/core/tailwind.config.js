const Color = require("color");
const alpha = (hexa, alpha = 1) => Color(hexa).alpha(alpha).rgb().toString();

/**
 * Start generic project config
 */
const col = 120;
const baseDuration = 750;
/**
 * End generic project config
 */

module.exports = {
  prefix: "",
  important: false,
  separator: ":",
  purge: {
    options: {
      safelist: {
        standard: [/^color--.*/]
      }
    }
  },
  darkMode: "class",
  theme: {
    screens: {
      "col-4": `${col * 4}px`, // 480px
      "col-5": `${col * 5}px`, // 600px
      "col-6": `${col * 6}px`, // 720px
      "col-7": `${col * 7}px`, // 840px
      "col-8": `${col * 8}px`, // 960px
      "col-9": `${col * 9}px`, // 1080px
      "col-10": `${col * 10}px`, // 1200px
      "col-11": `${col * 11}px`, // 1320px
      "col-12": `${col * 12}px` // 1440px
    },
    fontFamily: {
      main: [
        "Roboto",
        "-apple-system",
        "BlinkMacSystemFont",
        '"Segoe UI"',
        "Helvetica",
        "Arial",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"'
      ],
      sub: ['"Antic Slab"', "serif"],
      mono: [
        "SFMono-Regular",
        "Menlo",
        "Consolas",
        '"Liberation Mono"',
        "Courier",
        "monospace"
      ]
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      inherit: "inherit",
      slate: {
        DEFAULT: "#1e1919", // 800
        900: "#131010",
        700: "#292222",
        600: "#342b2b",
        100: "#6a5959",
        50: "#806b6b"
      },
      cream: {
        DEFAULT: "#fff7f7", // 800
        900: "#fffefe",
        700: "#ffe9e9",
        600: "#ffdbdb",
        100: "#ff9595",
        50: "#ff8787"
      },
      // o-20 used for tap highlight and inline code only
      navy: {
        DEFAULT: "#54669c",
        "o-20": alpha("#54669c", 0.2),
        100: "#7284ba"
      },
      beet: {
        DEFAULT: "#a54a5e",
        "o-20": alpha("#a54a5e", 0.2),
        100: "#c3687c"
      },
      flamingo: {
        DEFAULT: "#e84311",
        "o-20": alpha("#e84311", 0.2),
        100: "#ff6129"
      },
      ochre: {
        DEFAULT: "#f27502",
        "o-20": alpha("#f27502", 0.2),
        100: "#ff9320"
      },
      butter: {
        DEFAULT: "#ffb005",
        "o-20": alpha("#ffb005", 0.2),
        100: "#ffce23"
      },
      mantis: {
        DEFAULT: "#759f53",
        "o-20": alpha("#759f53", 0.2),
        100: "#93bd71"
      }
    },
    fontSize: {
      // "3xs": ["0.5rem", { lineHeight: 1.5 }], //   8px
      // "2xs": ["0.625rem", { lineHeight: 1.5 }], // 10px
      // xs: ["0.75rem", { lineHeight: 1.5 }], //     12px
      s: ["0.875rem", { lineHeight: 1.5 }], //     14px *
      m: ["1rem", { lineHeight: 1.5 }], //         16px *
      l: ["1.125rem", { lineHeight: 1.5 }], //     18px *
      xl: ["1.25rem", { lineHeight: 1.5 }], //     20px *
      "2xl": ["1.5rem", { lineHeight: 1.375 }], // 24px *
      "3xl": ["1.75rem", { lineHeight: 1.25 }], // 28px *
      // "4xl": ["2rem", { lineHeight: 1.25 }], //    32px
      "5xl": ["2.25rem", { lineHeight: 1.25 }], // 36px *
      // "6xl": ["2.75rem", { lineHeight: 1.25 }], // 44px
      // "7xl": ["3.25rem", { lineHeight: 1.25 }], // 52px
      // "8xl": ["4rem", { lineHeight: 1.25 }], //    64px
      // "9xl": ["4.5rem", { lineHeight: 1.25 }], //  72px
      "10xl": ["5rem", { lineHeight: 1 }] //       80px *
    },
    // Access from transition-
    transitionProperty: {
      none: "none",
      all: "all",
      color: "color",
      bg: "background-color",
      "bg-opacity": "background-color, opacity",
      colors: "background-color, border-color, color, fill, stroke",
      height: "height",
      width: "width",
      "width-height": "width, height",
      opacity: "opacity",
      transform: "transform",
      "opacity-transform": "opacity, transform"
    },
    // Access from duration-
    transitionDuration: {
      "1/8": `${Math.floor(baseDuration / 8)}ms`,
      "1/4": `${Math.floor(baseDuration / 4)}ms`,
      "1/2": `${Math.floor(baseDuration / 2)}ms`,
      "3/4": `${Math.floor((baseDuration / 4) * 3)}ms`,
      DEFAULT: `${baseDuration}ms`,
      double: `${baseDuration * 2}ms`
    },
    // Access from ease-
    transitionTimingFunction: {
      DEFAULT: "cubic-bezier(.54,.1,0,.99)"
    },
    extend: {
      opacity: {
        inherit: "inherit"
      },
      spacing: () => {
        const spacing = {
          inherit: "inherit",
          col: `${col}px`, // 120px
          "col-1": `${col}px`, // 120px
          "col-2": `${col * 2}px`, // 240px
          "col-3": `${col * 3}px`, // 360px
          "col-4": `${col * 4}px`, // 480px
          "col-5": `${col * 5}px`, // 600px
          "col-6": `${col * 6}px`, // 720px
          "col-7": `${col * 7}px`, // 840px
          "col-8": `${col * 8}px`, // 960px
          "col-9": `${col * 9}px`, // 1080px
          "col-10": `${col * 10}px`, // 1200px
          "col-11": `${col * 11}px`, // 1320px
          "col-12": `${col * 12}px` // 1440px
        };

        for (let i = 1; i <= 20; i++) {
          spacing[`${i * 5}vw`] = `${i * 5}vw`;
          spacing[`${i * 5}vh`] = `${i * 5}vh`;
          spacing[`${i * 5}p`] = `${i * 5}%`;
        }

        return spacing;
      },
      inset: theme => theme("spacing"),
      minWidth: theme => ({
        ...theme("spacing"),
        screen: "100vw",
        none: "none"
      }),
      maxWidth: theme => ({
        ...theme("spacing"),
        screen: "100vw",
        none: "none"
      }),
      height: theme => ({ ...theme("width"), screen: "100vh" }),
      minHeight: theme => ({
        ...theme("spacing"),
        screen: "100vh",
        none: "none"
      }),
      maxHeight: theme => ({
        ...theme("spacing"),
        screen: "100vh",
        none: "none"
      }),
      lineHeight: {
        0: 0
      }
    }
  },
  variants: {},
  corePlugins: {
    space: false
  },
  plugins: [
    ({ addBase, addUtilities, theme }) => {
      addBase({
        strong: { fontWeight: theme("fontWeight.bold") },
        "label, input, textarea, select": {
          display: "block",
          fontWeight: "inherit",
          fontStyle: "inherit"
        }
      });

      const stackUtilities = {};
      for (const spacing of [0, 1, 3, 5, 10, 12, 16, 24, 32]) {
        stackUtilities[
          `.stack-${spacing} > :not(.stack-exception) + :not(.stack-exception)`
        ] = {
          marginTop: `${spacing / 4}rem`
        };
      }
      addUtilities(stackUtilities, { variants: ["responsive"] });
    }
  ]
};
