import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import riot  from 'rollup-plugin-riot'


export default {
  input: 'src/animore.riot',
  output: [{
    format: 'umd',
    file: 'index.umd.js',
    name: 'Animore'
  }, {
    format: 'esm',
    file: 'index.js',
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
  ]
}
