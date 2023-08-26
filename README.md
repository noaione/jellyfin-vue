<h2 align="center">nao's Fork</h2>
<p align="center">A published forked version that includes some improvement<br/>See <strong><a href="#fork-changes">Fork Changes</a></strong> for more information<br/>https://jf-vue-nao.vercel.app/</p>

---

<h1 align="center">Jellyfin Vue</h1>
<h3 align="center">Part of the <a href="https://jellyfin.org">Jellyfin Project</a></h3>

---

<p align="center">
<img alt="Logo Banner" src="https://raw.githubusercontent.com/jellyfin/jellyfin-ux/master/branding/SVG/banner-logo-solid.svg?sanitize=true"/>
<a href="https://hub.docker.com/r/jellyfin/jellyfin-vue">
<img alt="Docker Pulls" src="https://img.shields.io/docker/pulls/jellyfin/jellyfin-vue">
</a>
<a href="https://github.com/jellyfin/jellyfin-vue/pkgs/container/jellyfin-vue">
<img alt="GHCR images" src="https://img.shields.io/badge/Github-packages-blue">
</a>
<a href="https://github.com/jellyfin/jellyfin-vue">
<img alt="GPL 3.0 License" src="https://img.shields.io/github/license/jellyfin/jellyfin-vue.svg"/>
</a>
<a href="https://translate.jellyfin.org/projects/jellyfin-vue/jellyfin-vue/">
<img src="https://translate.jellyfin.org/widgets/jellyfin-vue/-/jellyfin-vue/svg-badge.svg">
</a>
<a href="https://github.com/jellyfin/jellyfin-vue/releases">
<img alt="Current Release" src="https://img.shields.io/github/release/jellyfin/jellyfin-vue.svg"/>
</a>
<a href="https://conventionalcommits.org">
<img alt="Conventional Commits" src="https://img.shields.io/badge/Conventional%20Commits-%23FE5196?logo=conventionalcommits&logoColor=white" />
</a>
<a href="https://opencollective.com/jellyfin">
<img alt="Donate" src="https://img.shields.io/opencollective/all/jellyfin.svg?label=backers"/>
</a>
<a href="https://features.jellyfin.org">
<img alt="Feature Requests" src="https://img.shields.io/badge/fider-vote%20on%20features-success.svg"/>
</a>
<a href="https://matrix.to/#/#jellyfin-vue:matrix.org">
<img alt="Chat on Matrix" src="https://img.shields.io/matrix/jellyfin:matrix.org.svg?logo=matrix"/>
</a>
<a href="https://www.reddit.com/r/jellyfin">
<img alt="Join our Subreddit" src="https://img.shields.io/badge/reddit-r%2Fjellyfin-%23FF5700.svg"/>
</a>
<a href="https://sonarcloud.io/summary/new_code?id=jellyfin_jellyfin-vue">
<img alt="Code coverage"src="https://sonarcloud.io/api/project_badges/measure?project=jellyfin_jellyfin-vue&metric=coverage"/>
</a>
<a href="https://sonarcloud.io/summary/new_code?id=jellyfin_jellyfin-vue">
<img alt="Maintainability Rating"src="https://sonarcloud.io/api/project_badges/measure?project=jellyfin_jellyfin-vue&metric=sqale_rating"/>
</a>
<a href="https://sonarcloud.io/summary/new_code?id=jellyfin_jellyfin-vue">
<img alt="Reliability Rating"src="https://sonarcloud.io/api/project_badges/measure?project=jellyfin_jellyfin-vue&metric=reliability_rating"/>
</a>
<a href="https://sonarcloud.io/summary/new_code?id=jellyfin_jellyfin-vue">
<img alt="Vulnerabilities"src="https://sonarcloud.io/api/project_badges/measure?project=jellyfin_jellyfin-vue&metric=vulnerabilities"/>
</a>
<a href="https://sonarcloud.io/summary/new_code?id=jellyfin_jellyfin-vue">
<img alt="Code Smells"src="https://sonarcloud.io/api/project_badges/measure?project=jellyfin_jellyfin-vue&metric=code_smells"/>
</a>
<a href="https://sonarcloud.io/summary/new_code?id=jellyfin_jellyfin-vue">
<img alt="Technical debt"src="https://sonarcloud.io/api/project_badges/measure?project=jellyfin_jellyfin-vue&metric=sqale_index"/>
</a>
<a href="https://sonarcloud.io/summary/new_code?id=jellyfin_jellyfin-vue">
<img alt="Quality gate"src="https://sonarcloud.io/api/project_badges/measure?project=jellyfin_jellyfin-vue&metric=alert_status"/>
</a>
<a href="https://sonarcloud.io/summary/new_code?id=jellyfin_jellyfin-vue">
<img alt="Duplicated lines"src="https://sonarcloud.io/api/project_badges/measure?project=jellyfin_jellyfin-vue&metric=duplicated_lines_density"/>
</a>
<a href="https://sonarcloud.io/summary/new_code?id=jellyfin_jellyfin-vue">
<img alt="Bugs"src="https://sonarcloud.io/api/project_badges/measure?project=jellyfin_jellyfin-vue&metric=bugs"/>
</a>
<a href="https://sonarcloud.io/summary/new_code?id=jellyfin_jellyfin-vue">
<img alt="Security"src="https://sonarcloud.io/api/project_badges/measure?project=jellyfin_jellyfin-vue&metric=security_rating"/>
</a>
<a href="https://sonarcloud.io/summary/new_code?id=jellyfin_jellyfin-vue">
<img alt="Total lines"src="https://sonarcloud.io/api/project_badges/measure?project=jellyfin_jellyfin-vue&metric=ncloc"/>
</a>
</p>

---

This is an alternative client for Jellyfin based on Vue.js. It might not be feature complete and it's constantly evolving.

# For end users 👨‍👩‍👧‍👦

## [Hosted instance 🌍](https://jf-vue.pages.dev/)

Our hosted instance points to a version built from the current `master` branch. Hosted by CloudFlare Pages.

## Docker Container 📦

You can run the Docker container with the following command, replacing 8080 with the port of your choice:

```bash
docker run -d -p 8080:80 ghcr.io/jellyfin/jellyfin-vue
```

You can check [GitHub Packages (GHCR)](https://github.com/jellyfin/jellyfin-vue/pkgs/container/jellyfin-vue) (recommended) or [DockerHub](https://hub.docker.com/r/jellyfin/jellyfin-vue) for all the tagged images.

## Other means 💽

There are more ways to host Jellyfin Vue yourself.
Check [our wiki page](https://github.com/jellyfin/jellyfin-vue/wiki/Deployment-methods) for the most up to date information.

## Privacy disclaimer 🕵🏻

Jellyfin Vue is just a GUI _frontend_ for a Jellyfin server. It only establishes connection to the Jellyfin server that you point it to, **nothing else**.

- **Local instances** _Examples: Our Windows/Mac/Linux application, a local web server, etc_: All the necessary assets for the frontend to work
  are available locally (in your device) or bundled into the underlying environment (Tauri, Electron, etc) where it is running.
  No assets need to be fetched remotely.
- **Remote instances** _Examples: Our hosted instance, an admin hosting Jellyfin Vue and sharing the URL
  (which is in a different domain from the Jellyfin Server), etc_: This probably comprises most cases.
  Here, all the frontend assets are not locally available, but somewhere else. When you access the remotely hosted frontend
  (normally using a web browser like Firefox or Microsoft Edge),
  all the frontend assets are loaded/cached into your device. Once the load has finished,
  **the connection will exclusively be between your device and the Jellyfin server(s)** ¹². Whoever is serving the frontend
  is never in the middle. ³

¹ _Assuming that the hosted version has not been altered (by adding trackers, beacons...) in any way from the sources provided in this repository
and you trust the person/people behind it to not have done so_.

² _Some features that need access to remote resources that are not controlled by you and/or the person hosting Jellyfin Vue might be added in the future
(such as Google Cast support for Chromecasts). These will be always **opt in** and toggleable through [our configuration](https://github.com/jellyfin/jellyfin-vue/wiki/Configuration)_

³ _We assume standard networks here, no special configurations or policies that your ISP/Workplace/University/etc might apply._

For your interest, [Jellyfin Web](https://github.com/jellyfin/jellyfin-web) (our main frontend) works in a similar way:
It connects by default to the Jellyfin server that is running alongside,
but it's also capable to connect to other Jellyfin servers [like can be tested in our demo](https://demo.jellyfin.org/) and,
once loaded, only connections to fetch its own assets are made to the original server. Jellyfin Web can also be hosted standalone like Jellyfin Vue.

- _Relevant links_: [Community standards](https://jellyfin.org/docs/general/community-standards) and [Social Contract](https://github.com/jellyfin/jellyfin-meta/blob/master/policies-and-procedures/jellyfin-social-contract.md)

# For developers 🛠

## Dependencies

- [Node.js LTS](https://nodejs.org/en/download) `>=18.12.0 <19.0.0`
- npm `>=8.19.2` (included in Node.js)
- Jellyfin Server `>=10.7.0`

## Getting Started

1. Clone or download this repository:

   ```bash
   git clone https://github.com/jellyfin/jellyfin-vue.git
   cd jellyfin-vue
   ```

2. Install the build dependencies in the project directory:

   ```bash
   npm install
   ```

3. Run development build:

   ```bash
   npm start
   ```

   The client will be available at <http://127.0.0.1:3000> by default.

### Build for production 🏗️

When you're ready to deploy the client, you must build it for production specifically:

```bash
npm run build
```

Build output will be available under the `src/dist` folder.

## Other build features 🗜️

### Running a production build

After building the client, you can serve it directly:

```bash
npm run serve
```

There's also a shortcut for building the production version of the client and serving it afterwards:

```bash
npm run prod
```

⚠️ _Although the build of the client is production-ready, the internal HTTP server should never be exposed directly to the internet and a proper webserver like Nginx should always be used instead._

## Contributing 🤝

### Translations 🌐

Head over [our translation platform](https://translate.jellyfin.org/projects/jellyfin-vue/jellyfin-vue/)

### Code 🧮

We follow the **[fork and PR](https://docs.github.com/en/get-started/quickstart/contributing-to-projects)** paradigm.
We welcome all contributions and pull requests!

If you have larger changes in mind, split them up in smaller PRs as much as possible.
You can also open a GitHub Discussion or reach with us in Matrix to talk about the implementation details or the review process.

For more information, see [our contributing guide](https://github.com/jellyfin/jellyfin-vue/wiki/Contributing)

### Donations 💰

You can help the Jellyfin project as a whole pay for server and API expenses through our [OpenCollective](https://opencollective.com/jellyfin).

If you want to strictly donate to the developers of Jellyfin Vue, check [our top contributors](https://github.com/jellyfin/jellyfin-vue/graphs/contributors) and sponsor whoever you want.

The maintainers/leaders of the development of every Jellyfin project (including Jellyfin Vue) are listed [here](https://github.com/jellyfin/jellyfin-meta/blob/master/jellyfin-team.md#subproject-leaders).

### Fork Changes

The fork branch contains all the other branch implementation contained into one for deployment purpose. Might break something, so use it at your own risk.
Some of the old stuff in here already been PR'd to upstream, so this will be less important later I guess.

Now, here are the implemented stuff and also the planned stuff I want to do:

**Changes**
- A more strict markdown/HTML support ([`better-markdown-html-support`](https://github.com/noaione/jellyfin-vue/tree/better-markdown-html-support))
  - Using the `unified`/`remark`/`rehype` framework instead of `marked`
  - This will not allow every HTML tags to be used (See [`frontend/src/utils/render-markdown.ts`](https://github.com/noaione/jellyfin-vue/blob/nao/frontend/src/utils/render-markdown.ts#L11))
  - Disallow image, link, definition (including reference) markdown format.
  - The disallowed stuff will be kept in original format to notify that it's not supported
- Split more JS files into chunks ([`chunk-build`](https://github.com/noaione/jellyfin-vue/tree/chunk-build))
- Add video chapters to playback bar ([`video-chapters`](https://github.com/noaione/jellyfin-vue/tree/video-chapters))
- Add support for my Playlist Generator plugin ([`plugin-playlistgen`](https://github.com/noaione/jellyfin-vue/tree/plugin-playlistgen))
  - Plugin here: https://github.com/noaione/jellyfin-plugin-playlistgen/
- Vercel Deployment helper/support ([`vercel-support`](https://github.com/noaione/jellyfin-vue/tree/vercel-support))
  - Allow for a more easier deployment in Vercel

**Planned**
- Split or only allow selected localization to help reduce first-load JS more.
- More native support.