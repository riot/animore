import { pure, __ } from 'riot'
import { animate, utils } from 'animejs'

const { template, bindingTypes } = __.DOMBindings

/**
 * Get the boundaries of a DOM node and its opacity
 * @param   {HTMLElement} root - node we want to check
 * @returns {object} props
 * @property {object} bounds - node boundaries
 * @property {number} opacity - node opacity value
 */
function getProps(root) {
  return {
    bounds: root.getBoundingClientRect(),
    opacity: +(root.style.opacity || 1),
  }
}

export default pure(({ slots, attributes, props }) => {
  const evaluateAttribute = (name, ...args) => {
    if (!attributes) return

    const attr =
      (props && props[name]) || attributes.find((a) => a.name === name)

    if (attr) {
      return attr.evaluate(...args)
    }
  }

  /**
   * Internal helpers
   */

  /**
   * Apply a flip animation comparing the root previous position with the current one
   * @param {object} prevProps - dom node animation properties
   * @param {object} newProps - dom node animation properties
   * @param { HTMLElement } flipOpts - flip animation options
   * @returns {object} anime instance
   */
  function doFlip(prevProps, newProps, flipOpts) {
    return {
      translateX: [prevProps.bounds.left - newProps.bounds.left, 0],
      translateY: [prevProps.bounds.top - newProps.bounds.top, 0],
      scaleX: [prevProps.bounds.width / newProps.bounds.width, 1],
      scaleY: [prevProps.bounds.height / newProps.bounds.height, 1],
      opacity: [prevProps.opacity, newProps.opacity],
      ...(typeof flipOpts === 'object' ? flipOpts : {}),
    }
  }

  return {
    prevProps: null,
    mount(el, context) {
      const mountOptions = evaluateAttribute('mount', context)

      this.el = el
      this.createSlot(el, context)
      this.prevProps = getProps(el)

      if (!mountOptions) return

      this.el.style.visibility = 'hidden'

      this.animation = animate(this.el, {
        ...mountOptions,
        onBegin: (...args) => {
          this.el.style.visibility = null
          if (mountOptions.begin) mountOptions.begin(...args)
        },
        onComplete: (...args) => {
          this.prevProps = getProps(this.el)
          if (mountOptions.complete) mountOptions.complete(...args)
        },
      })
    },

    createSlot(el, context) {
      if (!slots || !slots.length) return

      this.slot = template(`<slot></slot>`, [
        {
          type: bindingTypes.SLOT,
          selector: 'slot',
          name: 'default',
        },
      ])

      this.slot.mount(
        this.el,
        {
          slots,
        },
        context,
      )
    },

    update(context) {
      const updateOptions = evaluateAttribute('update', context)

      if (this.slot) this.slot.update({}, context)
      if (this.animation) {
        this.animation.pause()
        utils.remove(this.el, this.animation)
      }

      if (updateOptions) {
        this.animation = animate(
          this.el,
          doFlip(this.prevProps, getProps(this.el), {
            ...updateOptions,
            onComplete: (...args) => {
              this.prevProps = getProps(this.el)
              if (updateOptions.complete) updateOptions.complete(...args)
            },
          }),
        )
      }
    },

    unmount(context, ...rest) {
      const unmountOptions = evaluateAttribute('unmount', context)
      const parentNode = this.el.parentNode

      const unmountSlot = (clone) => {
        if (!this.slot) return

        this.el.remove()
        clone && clone.remove()

        this.slot.unmount(context, ...rest)
        utils.remove(this.el, this.animation)
      }

      utils.remove(this.el, this.animation)

      if (unmountOptions && parentNode) {
        const clone = this.el.cloneNode(true)
        this.el.after(clone)
        this.animation = animate(clone, {
          ...unmountOptions,
          complete: (...args) => {
            unmountSlot(clone)
            if (unmountOptions.complete) unmountOptions.complete(...args)
          },
        })
      } else {
        unmountSlot()
      }
    },
  }
})
