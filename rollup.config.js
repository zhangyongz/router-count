import json from 'rollup-plugin-json'
import typescript from '@rollup/plugin-typescript'
import pkg from './package.json'
import { eslint } from 'rollup-plugin-eslint'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import { DEFAULT_EXTENSIONS } from '@babel/core'

export default {
  input: 'src/index.ts',
  output: [
    { file: pkg.main, name: 'routerCount', format: 'umd', sourcemap: true },
    { file: pkg.module, format: 'es', sourcemap: true }
  ],
  plugins: [
    json(),
    typescript(),
    eslint({
      throwOnError: true, // lint 结果有错误将会抛出异常
      throwOnWarning: true,
      include: ['src/**/*.ts'],
      exclude: ['node_modules/**', 'lib/**', '*.js']
    }),
    resolve(
      {
        extensions: ['.ts', '.d.ts', '.js']
      }
    ),
    commonjs(),
    babel({
      runtimeHelpers: true,
      // 只转换源代码，不运行外部依赖
      exclude: 'node_modules/**',
      // babel 默认不支持 ts 需要手动添加
      extensions: [
        ...DEFAULT_EXTENSIONS,
        '.ts'
      ]
    })
  ]
}
