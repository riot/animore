const riot = require('riot')
const raf = require('raf')
// node js DOM polyfills
require('jsdom-global')()
global.SVGElement = HTMLUnknownElement
global.requestAnimationFrame = raf
global.cancelAnimationFrame = raf.cancel
// require the lib
require('../')

function createWrapper(html) {
  const div = document.createElement('div')
  if (html) div.innerHTML = html
  document.body.appendChild(div)
  return div
}

describe('riot-animore core', () => {
  it('a simple tag can be properly animated on mount', (done) => {
    const tag = riot.mount(createWrapper('<p>hello</p>'), 'animate', {
      enter: {
        translateX: 1,
        duration: 200,
        complete() {
          done()
          tag.unmount()
        }
      }
    })[0]

  })

  it('a simple tag can be properly animated on unmount', (done) => {
    const tag = riot.mount(createWrapper('<p>hello</p>'), 'animate', {
      leave: {
        translateX: 1,
        duration: 200,
        complete() {
          done()
        }
      }
    })[0]

    tag.unmount()
  })

// TODO: fix me
  it('list items can properly handle flip animations', (done) => {
    riot.tag('list', '<ul><li data-is="animate" each="{ items }"></li></ul>', function() {
      this.items = [1, 2, 3]
    })
    let callCount = 0
    const tag = riot.mount(createWrapper(), 'list', {
      flip: {
        duration: 200,
        complete() {
          callCount ++
          if (callCount === 3) done()
        }
      }
    })[0]

    tag.items.reverse()
    tag.update()
  })
})