# riot-animore
Riot tags animations hooks via [anime](https://github.com/juliangarnier/anime). - beta release

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
  <p data-is="animore" mount={{ duration: 1000, translateX: [500, 0] }}>
    Hello there
  </p>
</my-tag>
```

[demo](http://plnkr.co/edit/ueWBXRKI5GiXOeWa2dHI?p=preview)

The `<p>` tag will be animated from a position of `transform: translateX(500px)` to `transform: translateX(0)` in `1000` milliseconds during the `mount` event. This animation will happend only once when mounted.

The animore tags can trigger the `mount` animation when used together with a riot `if` condition. For example:

```html
<my-tag>
  <p if={ isVisible } data-is="animore" mount={{ duration: 1000, translateX: [500, 0] }}>
    Hello there
  </p>

  <button onclick={ toggle }>toggle</button>

  <script>
    this.isVisible = true
    toggle() {
      this.isVisible = !this.isVisible
    }
  </script>
</my-tag>
```

[demo](http://plnkr.co/edit/8gcoxVfB4M1Ri4VkXYOP?p=preview)

The `mount` animation will be triggered whenever the `if` condition will change from `false` to `true`.


## Unmount

As for the `mount` the `unmount` animations will be triggered when an `animore` node will be unmounted. For example:

```html
<my-tag>
  <p if={ isVisible }
    data-is="animore"
    unmount={{ duration: 1000, translateX: 300 }}>
    Hello there
  </p>

  <button onclick={ toggle }>toggle</button>

  <script>
    this.isVisible = true
    toggle() {
      this.isVisible = !this.isVisible
    }
  </script>
</my-tag>
```

[demo](http://plnkr.co/edit/IS7S2pghzNnAIlxKDGN6?p=preview)

The above example will translate the `<p>` tag of `300px` in `1000` milliseconds before removing it from the DOM.


## Update

Animore makes the update transitions a lot easier thanks to the [`flip` approach](https://aerotwist.com/blog/flip-your-animations/). Animore will check the state of your tags before and after an update event trying to create a smooth animation between the two. For example:

```html
<my-tag>
  <article>
    <p if={ moreText }>{moreText}</p>
  </article>
  <article data-is="animore" update={{ duration: 500, easing: 'linear' }}>
    <p>Hello there</p>
  </article>

  <button onclick={ addMoreText }>more text</button>

  <script>
    addMoreText() {
      this.moreText = 'I am more text'
    }
  </script>
</my-tag>
```

[demo](http://plnkr.co/edit/DQaQ5RdWIN8xosVhdBdc?p=preview)

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

[demo](http://plnkr.co/edit/Wab3jbampHc7OKyLdQeR?p=preview)


# Callbacks

You can use all the animation [callbacks provided by anime](http://anime-js.com/documentation/#allCallbacks)

```html
<my-tag>
  <p data-is="animore" mount={{
    duration: 1000,
    translateX: [500, 0],
    complete: done
  }}>
    Hello there
  </p>

  <script>
    done() {
      console.log('i was mounted')
    }
  </script>
</my-tag>
```

[demo](http://plnkr.co/edit/FrHHmq34vzpB1LpUwLg3?p=preview)

[travis-image]:https://img.shields.io/travis/riot/animore.svg?style=flat-square
[travis-url]:https://travis-ci.org/riot/animore

[license-image]:http://img.shields.io/badge/license-MIT-000000.svg?style=flat-square
[license-url]:LICENSE.txt

[npm-version-image]:http://img.shields.io/npm/v/riot-animore.svg?style=flat-square
[npm-downloads-image]:http://img.shields.io/npm/dm/riot-animore.svg?style=flat-square
[npm-url]:https://npmjs.org/package/riot-animore