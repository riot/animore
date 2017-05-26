import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import buble from 'rollup-plugin-buble'

export default {
  entry: 'lib/index.js',
  format: 'umd',
  moduleName: 'animationTags',
  globals: {
    riot: 'riot'
  },
  interop: false,
  external: ['riot'],
  plugins: [ resolve(), commonjs(), buble() ]
}