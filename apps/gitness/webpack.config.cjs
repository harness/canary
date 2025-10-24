const { container } = require('webpack')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

const { ModuleFederationPlugin } = container

module.exports = {
  mode: 'development',
  // mode: 'production',
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
          requiredVersion: false,
          eager: true
        },
        'react-dom': {
          singleton: true,
          requiredVersion: false,
          eager: true
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
  ]
}
