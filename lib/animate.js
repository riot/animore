import riot from 'riot'
import anime from 'animejs'
import { onEnter, extend, getIndex, inheritFromParent, getProps } from './helpers'

export default riot.tag('animate', '<yield/>', function() {
  let prevProps, index

  // link to the current tag instance
  const self = this

  /**
   * Internal helpers
   */

  /**
   * Get the root element index from the parent node
   */
  function updateIndex() {
    index = getIndex(self.root)
  }

  /**
   * Apply a flip animation comparing the root previous position with the current one
   */
  function doFlip() {
    const newProps = getProps(self.root)
    anime(extend(typeof self.opts.flip === 'object' ? self.opts.flip : {}, {
      targets: self.root,
      translateX: [prevProps.bounds.left - newProps.bounds.left, 0],
      translateY: [prevProps.bounds.top - newProps.bounds.top, 0],
      scaleX: [prevProps.bounds.width / newProps.bounds.width, 1],
      scaleY: [prevProps.bounds.height / newProps.bounds.height, 1],
      opacity: [prevProps.opacity, newProps.opacity]
    }))
  }

  /**
   * Lifecycle events
   */

  function onCreate() {
    // make sure to avoid flickerings
    // in case of enter animations
    inheritFromParent(self)
    if (self.opts.enter) self.root.style.visibility = 'hidden'
  }

  function onMount() {
    updateIndex()
    onEnter(self.root, self.opts)
  }

  function onUpdate() {
    if (self.opts.flip) prevProps = getProps(self.root)
    inheritFromParent(self)
  }

  function onUpdated() {
    if (self.opts.flip) doFlip()
    updateIndex()
  }

  function onBeforeUnmount() {
    if (!self.opts.leave) return

    const clone = self.root.cloneNode(true),
      parentNode = self.root.parentNode

    parentNode.insertBefore(clone, parentNode.children[index])

    anime(extend({}, self.opts.leave, {
      targets: clone,
      complete: () => {
        parentNode.removeChild(clone)
        if (self.opts.leave.complete) self.opts.leave.complete(...arguments)
      }
    }))
  }

  function onUnmount() {
    if (self.parent) self.parent.off('update', onUpdate)
  }

  // lifecycle listeners
  this
    .one('mount', onMount)
    .on('updated', onUpdated)
    .on('unmount', onUnmount)
    .one('before-unmount', onBeforeUnmount)

  if (this.opts.flip) {
    if (this.parent) this.parent.on('update', onUpdate)
    else this.on('update', onUpdate)
  }

  // oncreate callback
  onCreate()
})
