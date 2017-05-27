import riot from 'riot'
import anime from 'animejs'
import { onEnter, extend, getIndex, inheritFromParent, getProps } from './helpers'

export default riot.tag('animate', '<yield/>', function() {
  let prevProps, index

  /**
   * Internal helpers
   */

  /**
   * Get the root element index from the parent node
   * @param { HTMLElement } root - tag root node
   */
  function updateIndex(root) {
    index = getIndex(root)
  }

  /**
   * Apply a flip animation comparing the root previous position with the current one
   * @param { HTMLElement } root - root tag
   * @param { HTMLElement } flipOpts - flip animation options
   */
  function doFlip(root, flipOpts) {
    const newProps = getProps(root)
    anime(extend(typeof flipOpts === 'object' ? flipOpts : {}, {
      targets: root,
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
  const lifecycle = {
    onCreate() {
      // make sure to avoid flickerings
      // in case of enter animations
      inheritFromParent(this)
      if (this.opts.enter) this.root.style.visibility = 'hidden'
    },
    onMount() {
      updateIndex(this.root)
      onEnter(this.root, this.opts)
    },

    onUpdate() {
      if (this.opts.flip) prevProps = getProps(this.root)
      inheritFromParent(this)
    },

    onUpdated() {
      if (this.opts.flip) doFlip(this.root, this.opts.flip)
      updateIndex(this.root)
    },

    onBeforeUnmount() {
      if (!this.opts.leave) return

      const clone = this.root.cloneNode(true),
        parentNode = this.root.parentNode

      parentNode.insertBefore(clone, parentNode.children[index])

      anime(extend({}, this.opts.leave, {
        targets: clone,
        complete: () => {
          parentNode.removeChild(clone)
          if (this.opts.leave.complete) this.opts.leave.complete(...arguments)
        }
      }))
    },
    onUnmount() {
      if (this.parent) this.parent.off('update', lifecycle.onUpdate)
    }
  }

  // lock the lifecycle events context
  Object.keys(lifecycle).forEach(event => lifecycle[event] = lifecycle[event].bind(this))

  // lifecycle listeners
  this
    .one('mount', lifecycle.onMount)
    .on('updated', lifecycle.onUpdated)
    .on('unmount', lifecycle.onUnmount)
    .one('before-unmount', lifecycle.onBeforeUnmount)

  // oncreate callback
  lifecycle.onCreate()

  if (this.opts.flip) {
    if (this.parent) this.parent.on('update', lifecycle.onUpdate)
    else this.on('update', lifecycle.onUpdate)
  }
})
