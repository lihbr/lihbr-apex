const Color = require("color");
const alpha = (hexa, alpha = 1) => Color(hexa).alpha(alpha).rgb().toString();
const lighten = (hexa, lighten = 1) =>
  Color(hexa).lighten(lighten).rgb().toString();

/**
 * Start generic project config
 */
const col = 120;
const baseDuration = 750;
/**
 * End generic project config
 */

module.exports = {
  target: "ie11",
  prefix: "",
  important: false,
  separator: ":",
  purge: {
    options: {
      whitelistPatterns: [/^color--.*/]
    }
  },
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
        "Segoe UI",
        "Helvetica",
        "Arial",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol"
      ],
      sub: ["Antic Slab", "serif"],
      mono: [
        "SFMono-Regular",
        "Menlo",
        "Consolas",
        "Liberation Mono",
        "Courier",
        "monospace"
      ]
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      inherit: "inherit",
      black: {
        default: "#141111",
        "l-25": lighten("#141111", 0.25)
      },
      white: {
        default: "#fffefe"
      },
      slate: {
        default: "#3b3211",
        "o-10": alpha("#3b3211", 0.1),
        "o-55": alpha("#3b3211", 0.55),
        "o-85": alpha("#3b3211", 0.85)
      },
      cream: {
        default: "#fff7f7"
      },
      green: {
        default: "#759f53",
        "o-20": alpha("#759f53", 0.2)
      },
      orange: {
        default: "#fd7b05",
        "o-20": alpha("#fd7b05", 0.2)
      },
      red: {
        default: "#e84311",
        "o-20": alpha("#e84311", 0.2)
      },
      beet: {
        default: "#6d313e",
        "o-20": alpha("#6d313e", 0.2)
      },
      navy: {
        default: "#3c496f",
        "o-20": alpha("#3c496f", 0.2)
      },
      yellow: {
        default: "#fecc0d",
        "o-20": alpha("#fecc0d", 0.2)
      }
    },
    fontSize: {
      "3xs": "0.5rem", //   8px
      "2xs": "0.625rem", // 10px
      xs: "0.75rem", //     12px
      s: "0.875rem", //     14px
      m: "1rem", //         16px
      l: "1.125rem", //     18px
      xl: "1.25rem", //     20px
      "2xl": "1.5rem", //   24px
      "3xl": "1.75rem", //  28px
      "4xl": "2rem", //     32px
      "5xl": "2.25rem", //  36px
      "6xl": "2.75rem", //  44px
      "7xl": "3.25rem", //  52px
      "8xl": "4rem", //     64px
      "9xl": "4.5rem", //   72px
      "10xl": "5rem" //     80px
    },
    opacity: {
      inherit: "inherit",
      0: "0",
      10: "0.1",
      20: "0.2",
      30: "0.3",
      40: "0.4",
      50: "0.5",
      60: "0.6",
      70: "0.7",
      80: "0.8",
      90: "0.9",
      100: "1"
    },
    // Access from transition-
    transitionProperty: {
      none: "none",
      all: "all",
      color: "color",
      bg: "background-color",
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
      base: `${baseDuration}ms`,
      double: `${baseDuration * 2}ms`
    },
    // Access from ease-
    transitionTimingFunction: {
      base: "cubic-bezier(.54,.1,0,.99)",
      // Functions from https://easings.net
      "in-sine": "cubic-bezier(0.47, 0, 0.745, 0.715)",
      "in-quad": "cubic-bezier(0.55, 0.085, 0.68, 0.53)",
      "in-cubic": "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
      "in-quart": "cubic-bezier(0.895, 0.03, 0.685, 0.22)",
      "in-quint": "cubic-bezier(0.755, 0.05, 0.855, 0.06)",
      "in-expo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
      "in-circ": "cubic-bezier(0.6, 0.04, 0.98, 0.335)",
      "in-back": "cubic-bezier(0.6, -0.28, 0.735, 0.045)",
      "out-sine": "cubic-bezier(0.39, 0.575, 0.565, 1)",
      "out-quad": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      "out-cubic": "cubic-bezier(0.215, 0.61, 0.355, 1)",
      "out-quart": "cubic-bezier(0.165, 0.84, 0.44, 1)",
      "out-quint": "cubic-bezier(0.23, 1, 0.32, 1)",
      "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
      "out-circ": "cubic-bezier(0.075, 0.82, 0.165, 1)",
      "out-back": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      "in-out-sine": "cubic-bezier(0.445, 0.05, 0.55, 0.95)",
      "in-out-quad": "cubic-bezier(0.455, 0.03, 0.515, 0.955)",
      "in-out-cubic": "cubic-bezier(0.645, 0.045, 0.355, 1)",
      "in-out-quart": "cubic-bezier(0.77, 0, 0.175, 1)",
      "in-out-quint": "cubic-bezier(0.86, 0, 0.07, 1)",
      "in-out-expo": "cubic-bezier(1, 0, 0, 1)",
      "in-out-circ": "cubic-bezier(0.785, 0.135, 0.15, 0.86)",
      "in-out-back": "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
    },
    extend: {
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
        ...theme("maxWidth"),
        screen: "100vh",
        none: "none"
      }),
      maxHeight: theme => ({
        ...theme("maxWidth"),
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
    backgroundOpacity: false,
    borderOpacity: false,
    divideColor: false,
    divideOpacity: false,
    divideWidth: false,
    gap: false,
    gridAutoFlow: false,
    gridColumn: false,
    gridColumnStart: false,
    gridColumnEnd: false,
    gridRow: false,
    gridRowStart: false,
    gridRowEnd: false,
    gridTemplateColumns: false,
    gridTemplateRows: false,
    objectFit: false,
    objectPosition: false,
    placeholderOpacity: false,
    rotate: false,
    scale: false,
    skew: false,
    space: false,
    textOpacity: false,
    transform: false,
    transformOrigin: false,
    translate: false
  },
  plugins: [
    ({ addBase, addUtilities, theme }) => {
      addBase({
        strong: { fontWeight: theme("fontWeight.bold") }
      });

      const objectFitUtilities = {
        ".object-cover": {
          objectFit: "cover",
          /* eslint-disable-next-line prettier/prettier */
          fontFamily: "\"object-fit: cover\""
        },
        ".object-contain": {
          objectFit: "contain",
          /* eslint-disable-next-line prettier/prettier */
          fontFamily: "\"object-fit: contain\""
        }
      };
      addUtilities(objectFitUtilities, {
        variants: ["responsive"]
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
