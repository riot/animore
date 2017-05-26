import riot from 'riot'
import anime from 'animejs'
import { onEnter, extend, getIndex } from './helpers'

export default riot.tag('animate', '<yield/>', function(opts) {
  let index

  // make sure to avoid flickerings
  // in case of enter animations
  if (opts.enter) this.root.style.visibility = 'hidden'

  function setIndex() {
    index = getIndex(this)
  }

  this
    .one('mount', () => onEnter(this))
    .one('mount', setIndex)
    .on('updated', setIndex)
    .one('before-unmount', () => {
      if (!opts.leave) return

      const clone = this.root.cloneNode(true),
        parentNode = this.root.parentNode

      parentNode.insertBefore(clone, parentNode.children[index])

      anime(extend({}, opts.leave, {
        targets: clone,
        complete() {
          parentNode.removeChild(clone)
        }
      }))
    })
})
