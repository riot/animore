# riot-animore
Riot tags animations middleware.

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-version-image]][npm-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![MIT License][license-image]][license-url]

# Installation

Via npm
```shell
$ npm i riot-animore -S
```

## Script import

Via `<script>`

```html
<script src="path/to/riot.js"></script>
<script src="path/to/riot-animore.js"></script>
```

Via ES2015 modules

```js
import riot from 'riot'
import 'riot-animore'
```

Via commonjs

```js
const riot = require('riot')
require('riot-animore')
```

# Usage

Riot animore is simply a riot tag that will enable DOM animations on the following events `mount`, `unmount` and `update`.
Any `animore` tag can have instructions to handle the animations on any of the desired riot events listed above.
The animation options must be valid [anime](https://github.com/juliangarnier/anime) params.

## Mount

For example:

```html
<my-tag>
  <p data-is="animore" mount={{ duration: 200, translateX: [-100, 0] }}>
    Hello there
  </p>
</my-tag>
```

The `<p>` tag will be animated from a position of `transform: translateX(-100px)` to `transform: translateX(0)` in `200` milliseconds during the `mount` event. This animation will happend only once when mounted.

The animore tags can trigger the `mount` animation when used together with a riot `if` condition. For example:

```html
<my-tag>
  <p if={ isVisible } data-is="animore" mount={{ duration: 200, translateX: [-100, 0] }}>
    Hello there
  </p>
</my-tag>
```

The `mount` animation will be triggered whenever the `if` condition will change from `false` to `true`.


## Unmount

As for the `mount` the `unmount` animations will be triggered when an `animore` node will be unmounted. For example:

```html
<my-tag>
  <p data-is="animore" unmount={{ duration: 200, translateX: 100 }}>
    Hello there
  </p>
</my-tag>
```

The above example will translate the `<p>` tag of `100px` in `200` milliseconds before removing it from the DOM.


## Update

Animore makes the update transitions a lot easier thanks to the [`flip` approach](https://aerotwist.com/blog/flip-your-animations/). Animore will check the state of your tags before and after an update event trying to create a smooth animation between the two. For example:

```html
<my-tag>
  <article data-is="animore" update={{ duration: 500, easing: 'linear' }}>
    <p>Hello there</p>
    <p if={ moreText }>{moreText}</p>
  </article>

  <button onclick={ addMoreText }></button>

  <script>
    addMoreText() {
      this.moreText = 'I am more text'
    }
  </script>
</my-tag>
```

In this case `animore` will update the `<article>` tag creating a smooth transition when more text will be added to it.


# List Items

`Animore` works also in riot `each` directives as long as you will not use the `no-reorder` attibute.
For example:

```html
<my-tag>
  <ul>
    <li
      each={ item, i in items }
      data-is="animore"
      update={{
        duration: 300,
        easing: 'linear'
      }}
      mount={{
        duration: 200,
        translateX: 100,
        offset: i * 100
      }}>
    Hello there
    </li>
  </ul>
</my-tag>
```

[travis-image]:https://img.shields.io/travis/riot/animore.svg?style=flat-square
[travis-url]:https://travis-ci.org/riot/animore

[license-image]:http://img.shields.io/badge/license-MIT-000000.svg?style=flat-square
[license-url]:LICENSE.txt

[npm-version-image]:http://img.shields.io/npm/v/riot-animore.svg?style=flat-square
[npm-downloads-image]:http://img.shields.io/npm/dm/riot-animore.svg?style=flat-square
[npm-url]:https://npmjs.org/package/riot-animore