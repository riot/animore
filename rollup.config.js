import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'

export default {
  input: 'src/animore.js',
  output: [
    {
      format: 'umd',
      file: 'index.umd.js',
      name: 'Animore',
    },
    {
      format: 'esm',
      file: 'index.js',
      name: 'Animore',
    },
  ],
  moduleName: 'Animore',
  globals: {
    riot: 'riot',
  },
  interop: false,
  external: ['riot'],
  plugins: [resolve(), commonjs()],
}
