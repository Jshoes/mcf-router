import nodeResolve from 'rollup-plugin-node-resolve';
import {sizeSnapshot} from 'rollup-plugin-size-snapshot';
import notify from 'rollup-plugin-notify';
import tscompile from 'typescript';
import typescript from 'rollup-plugin-typescript';
import extensions from 'rollup-plugin-extensions';

import pkg from './package.json';
const name = 'core';
const input = './modules/index.ts';

const globals = {
  qs: 'qs',
  'react-router-config': 'react-router-config',
  lodash: 'lodash',
  'path-to-regexp': 'path-to-regexp'
};

const commonjsOptions = {
  include: /node_modules/
};

export default [
  {
    input,
    output: {file: `cjs/${pkg.name}.js`, format: 'cjs'},
    external: Object.keys(globals),
    plugins: [
      nodeResolve(),
      typescript({typescript: tscompile}),
      sizeSnapshot(),
      notify(),
      extensions({extensions: ['.ts', '.js']})
    ]
  },
  {
    input,
    output: {file: `umd/${pkg.name}.js`, format: 'umd', name},
    external: Object.keys(globals),
    plugins: [
      nodeResolve(),
      typescript({typescript: tscompile}),
      extensions({extensions: ['.ts', '.js']}),
      sizeSnapshot(),
      notify()
    ]
  }
];
