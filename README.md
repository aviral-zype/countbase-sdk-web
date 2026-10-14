# Countbase Web SDK

[![npm version](https://img.shields.io/npm/v/countbase-sdk-web.svg)](https://www.npmjs.com/package/countbase-sdk-web)

Analytics, crash reporting, remote config and feedback widgets for websites and web apps,
reporting to a Countbase server.

Countbase Web SDK is a fork of the [Countly Web SDK](https://github.com/Countly/countly-sdk-web)
(MIT). It keeps Countly's request protocol, so it works with Countbase and Countly servers alike.

## Install

```bash
npm install countbase-sdk-web
```

```js
import Countbase from "countbase-sdk-web";

Countbase.init({
  app_key: "YOUR_APP_KEY",
  url: "https://countbase.example.com",
});
Countbase.track_sessions();
Countbase.track_pageview();

Countbase.add_event({ key: "signup", count: 1, segmentation: { plan: "pro" } });
```

Or load it from a CDN without a build step:

```html
<script src="https://cdn.jsdelivr.net/npm/countbase-sdk-web@latest/lib/countbase.min.js"></script>
<script>
  Countbase.init({ app_key: "YOUR_APP_KEY", url: "https://countbase.example.com" });
  Countbase.track_sessions();
</script>
```

The API is the same as the Countly Web SDK with `Countly` renamed to `Countbase`, so
[Countly's Web SDK documentation](https://support.count.ly/hc/en-us/articles/360037441932-Web-analytics-JavaScript-)
applies. More examples are in [`examples/`](examples/).

## Migrating from countly-sdk-web

- Replace the package `countly-sdk-web` with `countbase-sdk-web`.
- Rename the global/import `Countly` to `Countbase` (including `Countbase.q` in async snippets).
- Data stored in the browser (`cly_*` keys) and the server protocol are unchanged, so existing
  visitors keep their device IDs.

## Development

```bash
npm ci --legacy-peer-deps
npx eslint --ignore-path .eslintignore .
npx cypress run          # end-to-end tests
```

Releases are published to npm by GitHub Actions when a `v<version>` tag is pushed
(see `.github/workflows/publish.yml`).

## License

MIT. See [LICENSE](LICENSE); original work copyright Countly.
