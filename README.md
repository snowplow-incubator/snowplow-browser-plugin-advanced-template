# Snowplow Browser Plugin Advanced Example

[![License][license-image]](LICENSE)

This template demonstrates how to create a Browser Plugin to be used with `@snowplow/browser-tracker`.

This example can be cloned, modified and then published to npm.

## Maintainer quick start

Requires [Node](https://nodejs.org/en/) (10+).

### Setup repository

```bash
$ npm install
$ npm test
$ npm run build
```

## Package Publishing

Update `banner.js` and `package.json` with your information.

We advise naming the package `snowplow-browser-plugin-*` where `*` describes what this plugin does.

```bash
npm run build
npm login
npm publish
```

## Example Usage from npm

Initialize your tracker with the TemplatePlugin:

```js
import { newTracker } from '@snowplow/browser-tracker';
import { TemplatePlugin } from 'snowplow-browser-plugin-advanced-template';

newTracker('sp1', '{{collector}}', { plugins: [ TemplatePlugin() ] }); // Also stores reference at module level
```

Then use the available functions from this package to track to all trackers which have been initialized with this plugin:

```js
import { enableMyContext, trackMyEvent } from '@snowplow/browser-plugin-advanced-template';

enableMyContext({ property: 'something' });
trackMyEvent({ eventProp: 'value' });
```

## Example Usage with tag based tracker

Assuming `sp.js` or `sp.lite.js` has been loaded on `window.snowplow`, and this plugin is published on npm:

```js
window.snowplow('addPlugin', 
  "https://cdn.jsdelivr.net/npm/snowplow-browser-plugin-advanced-template@latest/dist/index.umd.min.js",
  ["snowplowAdvancedTemplate", "TemplatePlugin"]
);

window.snowplow('enableMyContext', { property: 'something' });
window.snowplow('trackMyEvent', { eventProp: 'value' });
);
```

## Copyright and license

Licensed and distributed under the [BSD 3-Clause License](LICENSE) ([An OSI Approved License][osi]).

Copyright (c) 2021 Snowplow Analytics Ltd.

All rights reserved.

[docs]: https://docs.snowplowanalytics.com/docs/collecting-data/collecting-from-own-applications/javascript-tracker/
[osi]: https://opensource.org/licenses/BSD-3-Clause
[license-image]: https://img.shields.io/github/license/snowplow-incubator/snowplow-browser-plugin-advanced-template
