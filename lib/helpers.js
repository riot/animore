import anime from 'animejs'
import riot from 'riot'

const riotExtend = riot.util.misc.extend
const slice = [].slice

export const extend = riotExtend

/**
 * Animation trigger when a tag gets mounted
 * @param   { HTMLElement } root - animate tag root node
 * @param   { Object } opts - animate tag options
 */
export function onMount(root, opts) {
  if (!opts.mount) return
  anime(extend({}, opts.mount, {
    targets: root,
    begin() {
      root.style.visibility = null
      if (opts.mount.begin) opts.mount.begin(...arguments)
    }
  }))
}

/**
 * Converts a NodeList to array
 * @param   { NodeList } nodes - dom nodes to arraify
 * @returns { Array } an array
 */
export function domToArray(nodes) {
  return slice.call(nodes)
}

/**
 * Get the position of a DOMNode according to its index into the parentNode children array
 * @param   { HTMLElement } root - DOM node to lookup
 * @returns { Number } node index position
 */
export function getIndex(root) {
  return domToArray(root.parentNode.children).indexOf(root)
}

/**
 * Get the boundaries of a DOM node and its opacity
 * @param   { HTMLElement } root - node we want to check
 * @returns { Object } props
 * @returns { Object } props.bounds - node boundaries
 * @returns { Number } props.opacity - node opacity value
 */
export function getProps(root) {
  return {
    bounds: root.getBoundingClientRect(),
    opacity: +(root.style.opacity || 1)
  }
}

/**
 * Extend a tag inheriting properties and methods from the parent node
 * @param   { riot.Tag } tag - riot tag instance
 */
export function inheritFromParent(tag) {
  // get the parent instance
  const parent = tag.parent

  for (let prop in parent) {
    let val = parent[prop]
    if (prop === 'opts') val = extend({}, val, tag.opts)

    tag[prop] =  typeof val === 'function' ? function(e, ...args) {
      e.preventUpdate = true
      val.apply(parent, [e, ...args])
      parent.update()
    } : val
  }
}
