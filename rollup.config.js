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
		//(await import('@rollup/plugin-terser')).default()
	],
	output: {
		file: './dist/js-awe.min.js',
		format: 'esm'
	},
  context: "this"
}))();