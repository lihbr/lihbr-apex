<p align="center">
  <a href="https://lihbr.com">
    <img src="https://images.prismic.io/lihbr/9ad2155a-e425-4b98-995d-24c6fae3ac3d_logo.png?auto=compress,format" alt="lihbr-apex" height="128" />
  </a>
</p>

# lihbr-apex [![Netlify Status](https://api.netlify.com/api/v1/badges/b6c4b56f-2cfe-4762-a68f-6cf7d5c730e7/deploy-status)](https://app.netlify.com/sites/lihbr/deploys) [![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/) [![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

> This is the source code of [lihbr.com](https://lihbr.com), my personal blog, you should check it out :D

## About

This application is made with [Vue.js](https://vuejs.org) via [Nuxt.js](https://nuxtjs.org), for detailed explanation about how those things are working please refer to their related documentation.

It also relies on [`@lihbr/utils-nuxt.*`](https://github.com/lihbr/utils-nuxt) and [`@lihbr/utils-netlify.*`](https://github.com/lihbr/utils-netlify) packages, which both are sets of personal helpers that I used to carry around from project to project before figuring out it might be handy to have them as packages.

Please bear in mind that this code is open source for the sake of sharing _how [lihbr.com](https://lihbr.com) is made_, it is **not** a _template for making websites_.

## Deployments

| Environment | Link                                           | Comment                                                                                                                                  |
| ----------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Production  | [lihbr.com](https://lihbr.com)                 | In sync with [master branch](https://github.com/lihbr/lihbr-apex/tree/master) and [Prismic](https://prismic.io) content                  |
| Staging     | [staging.lihbr.com](https://staging.lihbr.com) | In sync with [staging branch](https://github.com/lihbr/lihbr-apex/tree/staging), [Prismic](https://prismic.io) content might be outdated |

## Development

### Prerequisites

#### NPM

The root `.npmrc` file is expecting a `GITHUB_TOKEN` environment variable containing a personal access token to your GitHub account, learn how to get one on [GitHub's documentation](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token).

<!-- Uncomment if using SASS -->

#### `.sass` Files

In order to improve `.sass` files compilation, this project relies on `fibers`. While you should not have any problem with it on Mac or Linux OS you need on Windows to have few more dependencies:

```bash
$ npm install -g node-gyp@latest
$ npm install -g --production windows-build-tools
```

<!-- Uncomment if using Netlify functions -->

#### Netlify

As this project also makes use of [Netlify functions](https://docs.netlify.com/functions/overview), to run them locally you will need the Netlify's cli:

```bash
$ npm install -g netlify-cli
```

<!-- Uncomment if usage requires an internet connection -->

#### Internet

The develop and build process of this project requires an internet connection in order to fetch content from the datalayer, offline usage is not possible.

### Installation

After having the repository cloned just install node dependencies at root:

```bash
# install dependencies with yarn (recommended, actually I don't think npm will work haha)
$ yarn install
# or with npm
$ npm install
```

During the process you can create a `.env` file at `packages/core` by copying `.env.example` at the same location and start filling it with needed environment variables.

> Please note that the `.env` file also allows you to customize basic settings of the application, though it's highly recommended providing those values through a proper datalayer.

### Development

#### Starting Server Without Netlify Functions

To run the project without Netlify functions, simply run from project root:

```bash
# launch nuxt development server with yarn
$ yarn dev
# or with npm
$ npm run dev
```

Nuxt development server will be running at `localhost:3000`

#### Starting Server With Netlify Functions

If you want the project with Netlify functions available, run from project root:

```bash
# launch nuxt development server with yarn
$ yarn dev:netlify
# or with npm
$ npm run dev:netlify
```

> Be aware that you need Nuxt server to run on `localhost` host for `netlify dev` to be able to wrap the server.

Nuxt development server will be running with functions at `localhost:8888`

#### Plop

[Plop](https://plopjs.com) is configured on this project to generate regular components as well as pages and layouts ones.

To use Plop you need its CLI installed globally, if you do not have it already you can install it this way:

```bash
# install plop globally with yarn
$ yarn global add plop
# or with npm
$ npm install --global plop
```

Then launch the `plop` command from project root, it will guide you through creating desired components.

### Build

To build the project, simply run from project root:

```bash
# generate static project with yarn
$ yarn generate
# or with npm
$ npm run generate
```

You will end up with the built application at `packages/core/dist`, ready to be served on a CDN.

## Todo

- [ ] Fine-tune Sentry and setup release/commit tracking (lambda needs a build step)

<!--
- [x] Done item
- [ ] Todo item
-->
