import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import swc from '@rollup/plugin-swc';

export default {
  input: 'main.ts',
  output: {
    file: 'dist/main.js',
    name: 'opfs',
    format: 'es',
  },
  plugins: [
    swc({
      swc: {
        minify: true,
        env: {
          targets: {
            chrome: '113',
            firefox: '112',
          },
        },
      },
    }),
    resolve(),
    commonjs({
      extensions: ['.ts'],
    }),
  ],
};
