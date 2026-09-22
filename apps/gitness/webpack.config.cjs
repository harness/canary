// pnpm can install two physically separate copies of the `webpack` package here: one pulled in
// as a peer of `swc-loader` (which also peers on `@swc/core`), and another pulled in as a peer
// of `webpack-cli`. `webpack-cli`'s own Compiler/Compilation classes come from the latter, so a
// `ModuleFederationPlugin` built from the former fails an `instanceof Compilation` check at
// build time ("The 'compilation' argument must be an instance of Compilation"). Resolving
// `webpack` starting from `webpack-cli`'s own location guarantees we get the identical instance
// the CLI will use to run the compiler, regardless of which copy plain `require('webpack')`
// would otherwise pick up.
const webpackPath = require.resolve('webpack', { paths: [require.resolve('webpack-cli')] })
const { container } = require(webpackPath)
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

const { ModuleFederationPlugin } = container

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: './src/mfe-entry.ts',
  devServer: {
    port: 5137,
    historyApiFallback: true
    // headers: {
    //   'Access-Control-Allow-Origin': '*',
    //   'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    //   'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    // }
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      'react/jsx-dev-runtime': 'react/jsx-dev-runtime.js',
      'react/jsx-runtime': 'react/jsx-runtime.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx|ts)$/,
        exclude: /node_modules/,
        use: {
          loader: 'swc-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/, // handle Monaco's codicon.ttf
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]'
        }
      }
    ]
  },
  plugins: [
    new ModuleFederationPlugin({
      name: 'codev2',
      filename: 'remoteEntry.js',
      exposes: {
        './MicroFrontendApp': './src/AppMFE.tsx'
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: false
        },
        'react-dom': {
          singleton: true,
          requiredVersion: false
        }
      }
    }),
    new MonacoWebpackPlugin({
      // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
      languages: [
        'abap',
        'apex',
        'azcli',
        'bat',
        'bicep',
        'cameligo',
        'clojure',
        'coffee',
        'cpp',
        'csharp',
        'csp',
        'css',
        'cypher',
        'dart',
        'dockerfile',
        'ecl',
        'elixir',
        'flow9',
        'freemarker2',
        'fsharp',
        'go',
        'graphql',
        'handlebars',
        'hcl',
        'html',
        'ini',
        'java',
        'javascript',
        'json',
        'julia',
        'kotlin',
        'less',
        'lexon',
        'liquid',
        'lua',
        'm3',
        'markdown',
        'mips',
        'msdax',
        'mysql',
        'objective-c',
        'pascal',
        'pascaligo',
        'perl',
        'pgsql',
        'php',
        'pla',
        'postiats',
        'powerquery',
        'powershell',
        'protobuf',
        'pug',
        'python',
        'qsharp',
        'r',
        'razor',
        'redis',
        'redshift',
        'restructuredtext',
        'ruby',
        'rust',
        'sb',
        'scala',
        'scheme',
        'scss',
        'shell',
        'solidity',
        'sophia',
        'sparql',
        'sql',
        'st',
        'swift',
        'systemverilog',
        'tcl',
        'twig',
        'typescript',
        'vb',
        'wgsl',
        'xml',
        'yaml'
      ],
      globalAPI: true,
      filename: '[name].worker.[contenthash:6].js',
      customLanguages: [
        {
          label: 'yaml',
          entry: 'monaco-yaml',
          worker: {
            id: 'monaco-yaml/yamlWorker',
            entry: 'monaco-yaml/yaml.worker'
          }
        }
      ]
    })
  ],
  output: {
    filename: '[name].[contenthash:6].js',
    path: __dirname + '/dist',
    clean: true
  }
}
