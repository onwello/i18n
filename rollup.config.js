import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default [
  // Main bundle
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named'
      },
      {
        file: 'dist/index.esm.js',
        format: 'esm',
        sourcemap: true,
        exports: 'named'
      }
    ],
    external: ['@nestjs/common', '@nestjs/core'],
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      terser({
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      })
    ]
  },
  // RTL utilities bundle
  {
    input: 'src/rtl.ts',
    output: [
      {
        file: 'dist/rtl.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named'
      },
      {
        file: 'dist/rtl.esm.js',
        format: 'esm',
        sourcemap: true,
        exports: 'named'
      }
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      terser({
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      })
    ]
  },
  // Decorators bundle
  {
    input: 'src/decorators.ts',
    output: [
      {
        file: 'dist/decorators.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named'
      },
      {
        file: 'dist/decorators.esm.js',
        format: 'esm',
        sourcemap: true,
        exports: 'named'
      }
    ],
    external: ['@nestjs/common', '@nestjs/core'],
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      terser({
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      })
    ]
  },
  // Exceptions bundle
  {
    input: 'src/exceptions.ts',
    output: [
      {
        file: 'dist/exceptions.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named'
      },
      {
        file: 'dist/exceptions.esm.js',
        format: 'esm',
        sourcemap: true,
        exports: 'named'
      }
    ],
    external: ['@nestjs/common'],
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      terser({
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      })
    ]
  },
  // GraphQL bundle
  {
    input: 'src/graphql/index.ts',
    output: [
      {
        file: 'dist/graphql.js',
        format: 'cjs',
        sourcemap: true,
        exports: 'named'
      },
      {
        file: 'dist/graphql.esm.js',
        format: 'esm',
        sourcemap: true,
        exports: 'named'
      }
    ],
    external: ['@nestjs/common', '@nestjs/core', '@apollo/server', 'graphql', 'graphql-tag'],
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      terser({
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      })
    ]
  }
]; 