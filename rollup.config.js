// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import nodePolyfills from 'rollup-plugin-node-polyfills';

export default (async () => ({
	input: 'src/index.js',
	plugins: [
		resolve(),
		commonjs(),
    nodePolyfills(),
	],
	output: {
		file: './dist/browser/js-awe.js',
		format: 'esm'
	},
  context: "this"
}))();