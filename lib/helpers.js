import anime from 'animejs'

const riotExtend = riot.util.misc.extend
const slice = [].slice

export const extend = riotExtend

export function onEnter({ opts, root }) {
  if (!opts.enter) return
  anime(extend({}, opts.enter, {
    targets: root,
    begin() { root.style.visibility = null }
  }))
}

export function domToArray(nodes) {
  return slice.call(nodes)
}

export function getIndex({root}) {
  return domToArray(root.parentNode.children).indexOf(root)
}

export function getProps(root) {
  return {
    bounds: root.getBoundingClientRect(),
    opacity: root.style.opacity
  }
}
