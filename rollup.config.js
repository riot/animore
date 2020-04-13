import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import riot  from 'rollup-plugin-riot'


export default {
  input: 'lib/index.js',
  output: [{
    format: 'umd',
    name: 'Animore'
  }],
  moduleName: 'Animore',
  globals: {
    riot: 'riot'
  },
  interop: false,
  external: ['riot'],
  plugins: [
    resolve(),
    commonjs(),
    riot(),
    babel({
      presets: ['@riotjs/babel-preset']
    })
  ]
}