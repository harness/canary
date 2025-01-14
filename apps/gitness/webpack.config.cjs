const HtmlWebpackPlugin = require('html-webpack-plugin')
const { container } = require('webpack')

const { ModuleFederationPlugin } = container

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: './src/dummy.ts',
  devServer: {
    port: 5137,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
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
      name: 'gitness',
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
    new HtmlWebpackPlugin({
      template: './index.html',
      crossorigin: 'anonymous'
    })
  ]
}
