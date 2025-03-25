import path from 'path'

module.exports = {
  target: ['web', 'node'],
  entry: 'src/index.tsx',
  mode: 'production',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'YamlEditor'
  },
  externals: {
    'monaco-editor': 'monaco-editor',
    'monaco-yaml': 'monaco-yaml',
    react: 'react',
    'react-dom': 'react-dom',
    'monaco-editor/esm/vs/editor/standalone/browser/standaloneServices.js':
      'monaco-editor/esm/vs/editor/standalone/browser/standaloneServices.js',
    'monaco-editor/esm/vs/editor/standalone/browser/outlineModel.js':
      'monaco-editor/esm/vs/editor/standalone/browser/outlineModel.js',
    'monaco-editor/esm/vs/editor/standalone/browser/ILanguageFeaturesService.js':
      'monaco-editor/esm/vs/editor/standalone/browser/ILanguageFeaturesService.js'
  },
  resolve: {
    modules: [__dirname, 'src', 'node_modules'],
    extensions: ['.js', '.jsx', '.tsx', '.ts']
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        resolve: {
          extensions: ['.ts', '.tsx', '.js', '.json']
        },
        use: 'ts-loader'
      },
      {
        test: /\.css$/,
        // exclude: /node_modules/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        exclude: /node_modules/,
        use: ['file-loader']
      }
    ]
  }
}
