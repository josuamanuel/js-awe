// rollup.config.js
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/anonymize.js',
  output: {
    file: 'dist/anonymize.js',
    format: 'umd',
    name: 'awe',
    //inlineDynamicImports: true
  },
  plugins: [
    resolve(),
    commonjs()
  ]
};