import dts from 'rollup-plugin-dts';

export default [
  // Configuration for building the TypeScript declaration file
  {
    input: './types/index.d.ts',
    output: {
      file: './dist/browser/js-awe.min.d.ts',
      format: 'es',
    },
    plugins: [
      dts(),
    ],
  },
];