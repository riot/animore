import { pure, __ } from 'riot'
import anime from 'animejs'

const { template, bindingTypes } = __.DOMBindings

/**
 * Get the boundaries of a DOM node and its opacity
 * @param   { HTMLElement } root - node we want to check
 * @returns { Object } props
 * @returns { Object } props.bounds - node boundaries
 * @returns { number } props.opacity - node opacity value
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
   * @param { Object } prevProps - dom node animation properties
   * @param { Object } newProps - dom node animation properties
   * @param { HTMLElement } flipOpts - flip animation options
   * @return { Object } anime instance
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

      this.animation = anime({
        ...mountOptions,
        targets: this.el,
        begin: (...args) => {
          this.el.style.visibility = null
          if (mountOptions.begin) mountOptions.begin(...args)
        },
        complete: (...args) => {
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
        anime.remove(this.animation)
      }

      if (updateOptions) {
        this.animation = anime(
          doFlip(this.prevProps, getProps(this.el), {
            ...updateOptions,
            targets: this.el,
            complete: (...args) => {
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
        anime.remove(this.animation)
      }

      anime.remove(this.animation)

      if (unmountOptions && parentNode) {
        const clone = this.el.cloneNode(true)
        this.el.after(clone)
        this.animation = anime({
          ...unmountOptions,
          targets: clone,
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
