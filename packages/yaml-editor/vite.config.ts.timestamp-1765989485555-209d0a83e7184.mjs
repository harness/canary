// vite.config.ts

import { resolve } from 'path'

import react from 'file:///Users/pilatbanga/ch0/canary/node_modules/.pnpm/@vitejs+plugin-react-swc@3.8.0_vite@4.5.9_@types+node@16.18.126_terser@5.39.0_/node_modules/@vitejs/plugin-react-swc/index.mjs'
import dts from 'file:///Users/pilatbanga/ch0/canary/node_modules/.pnpm/vite-plugin-dts@3.9.1_@types+node@16.18.126_rollup@4.34.9_typescript@5.9.2_vite@4.5.9_@types+_dsgwmnlhraal6q4mzcktfqb4eq/node_modules/vite-plugin-dts/dist/index.mjs'
import monacoEditorPlugin from 'file:///Users/pilatbanga/ch0/canary/node_modules/.pnpm/vite-plugin-monaco-editor@1.1.0_monaco-editor@0.40.0/node_modules/vite-plugin-monaco-editor/dist/index.js'
import { defineConfig } from 'file:///Users/pilatbanga/ch0/canary/node_modules/.pnpm/vite@4.5.9_@types+node@16.18.126_terser@5.39.0/node_modules/vite/dist/node/index.js'

// package.json
var package_default = {
  name: '@harnessio/yaml-editor',
  version: '0.22.0',
  private: false,
  author: 'Harness Inc.',
  license: 'Apache-2.0',
  type: 'module',
  module: './dist/index.js',
  main: './dist/index.js',
  files: ['dist'],
  '.': {
    require: './dist/index.cjs',
    import: './dist/index.js',
    types: './dist/index.d.ts'
  },
  types: './dist/index.d.ts',
  scripts: {
    dev: 'vite build --watch',
    webpack: 'webpack',
    build: 'vite build',
    'build:ci': 'vite build',
    'build:watch': 'vite build --watch',
    prepublishOnly: 'pnpm build',
    pretty: 'prettier --check ./src',
    lint: 'eslint ./src',
    'pre-commit': 'lint-staged',
    playground: 'vite dev --config vite.config.playground.ts'
  },
  dependencies: {
    '@monaco-editor/react': '4.6.0'
  },
  peerDependencies: {
    'monaco-editor': '^0.40.0',
    'monaco-yaml': '^4.0.4',
    react: '^17.0.2',
    'react-dom': '^17.0.2'
  },
  devDependencies: {
    '@babel/core': '^7.24.7',
    '@babel/preset-env': '^7.24.7',
    '@babel/preset-react': '^7.24.7',
    '@babel/preset-typescript': '^7.24.7',
    '@testing-library/jest-dom': '^5.17.0',
    '@testing-library/react': '^12.1.5',
    '@testing-library/user-event': '^13.5.0',
    '@types/jest': '^27.5.2',
    '@types/node': '^16.18.101',
    '@types/react': '^17.0.3',
    '@types/react-dom': '^17.0.3',
    '@vitejs/plugin-react': '^4.0.4',
    '@vitejs/plugin-react-swc': '^3.5.0',
    'babel-loader': '^9.1.3',
    'babel-plugin-syntax-dynamic-import': '^6.18.0',
    'babel-plugin-transform-class-properties': '^6.24.1',
    'babel-plugin-transform-es2015-modules-commonjs': '^6.26.2',
    'css-loader': '^7.1.2',
    'file-loader': '^6.2.0',
    'html-webpack-plugin': '^5.6.0',
    'lint-staged': '^15.2.9',
    'mini-css-extract-plugin': '^2.9.0',
    'monaco-editor-webpack-plugin': '^7.1.0',
    'sass-loader': '^14.2.1',
    'style-loader': '^4.0.0',
    'ts-loader': '^9.5.1',
    'url-loader': '^4.1.1',
    vite: '^4.4.9',
    'vite-plugin-dts': '^3.9.1',
    'vite-plugin-monaco-editor': '^1.1.0',
    watch: '^1.0.2',
    webpack: '^5.92.1',
    'webpack-cli': '^5.1.4',
    'webpack-dev-server': '^5.0.4'
  },
  'lint-staged': {
    '*.{js,jsx,ts,tsx}': ['eslint --fix', 'prettier --write']
  }
}

// vite.config.ts
var __vite_injected_original_dirname = '/Users/pilatbanga/ch0/canary/packages/yaml-editor'
var external = Object.keys(package_default.devDependencies || [])
  .concat(Object.keys(package_default.peerDependencies || []))
  .concat(Object.keys(package_default.peerDependencies || []))
  .concat([
    'monaco-editor/esm/vs/editor/standalone/browser/standaloneServices.js',
    'monaco-editor/esm/vs/editor/standalone/browser/outlineModel.js',
    'monaco-editor/esm/vs/editor/standalone/browser/ILanguageFeaturesService.js'
  ])
var vite_config_default = defineConfig({
  define: { 'process.env.NODE_ENV': '"production"' },
  plugins: [
    react(),
    dts({
      outDir: 'dist',
      tsconfigPath: './tsconfig.json'
    }),
    monacoEditorPlugin.default({ customWorkers: [{ entry: 'monaco-yaml/yaml.worker', label: 'yaml' }] })
  ],
  build: {
    sourcemap: true,
    copyPublicDir: false,
    lib: {
      entry: resolve(__vite_injected_original_dirname, 'src/index.ts'),
      name: 'yaml-editor',
      fileName: 'index',
      formats: ['es', 'cjs']
    },
    rollupOptions: { external }
  }
})
export { vite_config_default as default }
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL3BpbGF0YmFuZ2EvY2gwL2NhbmFyeS9wYWNrYWdlcy95YW1sLWVkaXRvclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3BpbGF0YmFuZ2EvY2gwL2NhbmFyeS9wYWNrYWdlcy95YW1sLWVkaXRvci92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvcGlsYXRiYW5nYS9jaDAvY2FuYXJ5L3BhY2thZ2VzL3lhbWwtZWRpdG9yL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXG5cbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2MnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IGR0cyBmcm9tICd2aXRlLXBsdWdpbi1kdHMnXG5pbXBvcnQgbW9uYWNvRWRpdG9yUGx1Z2luIGZyb20gJ3ZpdGUtcGx1Z2luLW1vbmFjby1lZGl0b3InXG5cbmltcG9ydCBwa2cgZnJvbSAnLi9wYWNrYWdlLmpzb24nXG5cbmNvbnN0IGV4dGVybmFsID0gT2JqZWN0LmtleXMocGtnLmRldkRlcGVuZGVuY2llcyB8fCBbXSlcbiAgLmNvbmNhdChPYmplY3Qua2V5cyhwa2cucGVlckRlcGVuZGVuY2llcyB8fCBbXSkpXG4gIC5jb25jYXQoT2JqZWN0LmtleXMocGtnLnBlZXJEZXBlbmRlbmNpZXMgfHwgW10pKVxuICAuY29uY2F0KFtcbiAgICAnbW9uYWNvLWVkaXRvci9lc20vdnMvZWRpdG9yL3N0YW5kYWxvbmUvYnJvd3Nlci9zdGFuZGFsb25lU2VydmljZXMuanMnLFxuICAgICdtb25hY28tZWRpdG9yL2VzbS92cy9lZGl0b3Ivc3RhbmRhbG9uZS9icm93c2VyL291dGxpbmVNb2RlbC5qcycsXG4gICAgJ21vbmFjby1lZGl0b3IvZXNtL3ZzL2VkaXRvci9zdGFuZGFsb25lL2Jyb3dzZXIvSUxhbmd1YWdlRmVhdHVyZXNTZXJ2aWNlLmpzJ1xuICBdKVxuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBkZWZpbmU6IHsgJ3Byb2Nlc3MuZW52Lk5PREVfRU5WJzogJ1wicHJvZHVjdGlvblwiJyB9LFxuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBkdHMoe1xuICAgICAgb3V0RGlyOiAnZGlzdCcsXG4gICAgICB0c2NvbmZpZ1BhdGg6ICcuL3RzY29uZmlnLmpzb24nXG4gICAgfSksXG4gICAgbW9uYWNvRWRpdG9yUGx1Z2luLmRlZmF1bHQoeyBjdXN0b21Xb3JrZXJzOiBbeyBlbnRyeTogJ21vbmFjby15YW1sL3lhbWwud29ya2VyJywgbGFiZWw6ICd5YW1sJyB9XSB9KVxuICBdLFxuICBidWlsZDoge1xuICAgIHNvdXJjZW1hcDogdHJ1ZSxcbiAgICBjb3B5UHVibGljRGlyOiBmYWxzZSxcbiAgICBsaWI6IHtcbiAgICAgIGVudHJ5OiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9pbmRleC50cycpLFxuICAgICAgbmFtZTogJ3lhbWwtZWRpdG9yJyxcbiAgICAgIGZpbGVOYW1lOiAnaW5kZXgnLFxuICAgICAgZm9ybWF0czogWydlcycsICdjanMnXVxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczogeyBleHRlcm5hbCB9XG4gIH1cbn0pXG4iLCAie1xuICBcIm5hbWVcIjogXCJAaGFybmVzc2lvL3lhbWwtZWRpdG9yXCIsXG4gIFwidmVyc2lvblwiOiBcIjAuMjIuMFwiLFxuICBcInByaXZhdGVcIjogZmFsc2UsXG4gIFwiYXV0aG9yXCI6IFwiSGFybmVzcyBJbmMuXCIsXG4gIFwibGljZW5zZVwiOiBcIkFwYWNoZS0yLjBcIixcbiAgXCJ0eXBlXCI6IFwibW9kdWxlXCIsXG4gIFwibW9kdWxlXCI6IFwiLi9kaXN0L2luZGV4LmpzXCIsXG4gIFwibWFpblwiOiBcIi4vZGlzdC9pbmRleC5qc1wiLFxuICBcImZpbGVzXCI6IFtcbiAgICBcImRpc3RcIlxuICBdLFxuICBcIi5cIjoge1xuICAgIFwicmVxdWlyZVwiOiBcIi4vZGlzdC9pbmRleC5janNcIixcbiAgICBcImltcG9ydFwiOiBcIi4vZGlzdC9pbmRleC5qc1wiLFxuICAgIFwidHlwZXNcIjogXCIuL2Rpc3QvaW5kZXguZC50c1wiXG4gIH0sXG4gIFwidHlwZXNcIjogXCIuL2Rpc3QvaW5kZXguZC50c1wiLFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwiZGV2XCI6IFwidml0ZSBidWlsZCAtLXdhdGNoXCIsXG4gICAgXCJ3ZWJwYWNrXCI6IFwid2VicGFja1wiLFxuICAgIFwiYnVpbGRcIjogXCJ2aXRlIGJ1aWxkXCIsXG4gICAgXCJidWlsZDpjaVwiOiBcInZpdGUgYnVpbGRcIixcbiAgICBcImJ1aWxkOndhdGNoXCI6IFwidml0ZSBidWlsZCAtLXdhdGNoXCIsXG4gICAgXCJwcmVwdWJsaXNoT25seVwiOiBcInBucG0gYnVpbGRcIixcbiAgICBcInByZXR0eVwiOiBcInByZXR0aWVyIC0tY2hlY2sgLi9zcmNcIixcbiAgICBcImxpbnRcIjogXCJlc2xpbnQgLi9zcmNcIixcbiAgICBcInByZS1jb21taXRcIjogXCJsaW50LXN0YWdlZFwiLFxuICAgIFwicGxheWdyb3VuZFwiOiBcInZpdGUgZGV2IC0tY29uZmlnIHZpdGUuY29uZmlnLnBsYXlncm91bmQudHNcIlxuICB9LFxuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAbW9uYWNvLWVkaXRvci9yZWFjdFwiOiBcIjQuNi4wXCJcbiAgfSxcbiAgXCJwZWVyRGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIm1vbmFjby1lZGl0b3JcIjogXCJeMC40MC4wXCIsXG4gICAgXCJtb25hY28teWFtbFwiOiBcIl40LjAuNFwiLFxuICAgIFwicmVhY3RcIjogXCJeMTcuMC4yXCIsXG4gICAgXCJyZWFjdC1kb21cIjogXCJeMTcuMC4yXCJcbiAgfSxcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQGJhYmVsL2NvcmVcIjogXCJeNy4yNC43XCIsXG4gICAgXCJAYmFiZWwvcHJlc2V0LWVudlwiOiBcIl43LjI0LjdcIixcbiAgICBcIkBiYWJlbC9wcmVzZXQtcmVhY3RcIjogXCJeNy4yNC43XCIsXG4gICAgXCJAYmFiZWwvcHJlc2V0LXR5cGVzY3JpcHRcIjogXCJeNy4yNC43XCIsXG4gICAgXCJAdGVzdGluZy1saWJyYXJ5L2plc3QtZG9tXCI6IFwiXjUuMTcuMFwiLFxuICAgIFwiQHRlc3RpbmctbGlicmFyeS9yZWFjdFwiOiBcIl4xMi4xLjVcIixcbiAgICBcIkB0ZXN0aW5nLWxpYnJhcnkvdXNlci1ldmVudFwiOiBcIl4xMy41LjBcIixcbiAgICBcIkB0eXBlcy9qZXN0XCI6IFwiXjI3LjUuMlwiLFxuICAgIFwiQHR5cGVzL25vZGVcIjogXCJeMTYuMTguMTAxXCIsXG4gICAgXCJAdHlwZXMvcmVhY3RcIjogXCJeMTcuMC4zXCIsXG4gICAgXCJAdHlwZXMvcmVhY3QtZG9tXCI6IFwiXjE3LjAuM1wiLFxuICAgIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjogXCJeNC4wLjRcIixcbiAgICBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiOiBcIl4zLjUuMFwiLFxuICAgIFwiYmFiZWwtbG9hZGVyXCI6IFwiXjkuMS4zXCIsXG4gICAgXCJiYWJlbC1wbHVnaW4tc3ludGF4LWR5bmFtaWMtaW1wb3J0XCI6IFwiXjYuMTguMFwiLFxuICAgIFwiYmFiZWwtcGx1Z2luLXRyYW5zZm9ybS1jbGFzcy1wcm9wZXJ0aWVzXCI6IFwiXjYuMjQuMVwiLFxuICAgIFwiYmFiZWwtcGx1Z2luLXRyYW5zZm9ybS1lczIwMTUtbW9kdWxlcy1jb21tb25qc1wiOiBcIl42LjI2LjJcIixcbiAgICBcImNzcy1sb2FkZXJcIjogXCJeNy4xLjJcIixcbiAgICBcImZpbGUtbG9hZGVyXCI6IFwiXjYuMi4wXCIsXG4gICAgXCJodG1sLXdlYnBhY2stcGx1Z2luXCI6IFwiXjUuNi4wXCIsXG4gICAgXCJsaW50LXN0YWdlZFwiOiBcIl4xNS4yLjlcIixcbiAgICBcIm1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXCI6IFwiXjIuOS4wXCIsXG4gICAgXCJtb25hY28tZWRpdG9yLXdlYnBhY2stcGx1Z2luXCI6IFwiXjcuMS4wXCIsXG4gICAgXCJzYXNzLWxvYWRlclwiOiBcIl4xNC4yLjFcIixcbiAgICBcInN0eWxlLWxvYWRlclwiOiBcIl40LjAuMFwiLFxuICAgIFwidHMtbG9hZGVyXCI6IFwiXjkuNS4xXCIsXG4gICAgXCJ1cmwtbG9hZGVyXCI6IFwiXjQuMS4xXCIsXG4gICAgXCJ2aXRlXCI6IFwiXjQuNC45XCIsXG4gICAgXCJ2aXRlLXBsdWdpbi1kdHNcIjogXCJeMy45LjFcIixcbiAgICBcInZpdGUtcGx1Z2luLW1vbmFjby1lZGl0b3JcIjogXCJeMS4xLjBcIixcbiAgICBcIndhdGNoXCI6IFwiXjEuMC4yXCIsXG4gICAgXCJ3ZWJwYWNrXCI6IFwiXjUuOTIuMVwiLFxuICAgIFwid2VicGFjay1jbGlcIjogXCJeNS4xLjRcIixcbiAgICBcIndlYnBhY2stZGV2LXNlcnZlclwiOiBcIl41LjAuNFwiXG4gIH0sXG4gIFwibGludC1zdGFnZWRcIjoge1xuICAgIFwiKi57anMsanN4LHRzLHRzeH1cIjogW1xuICAgICAgXCJlc2xpbnQgLS1maXhcIixcbiAgICAgIFwicHJldHRpZXIgLS13cml0ZVwiXG4gICAgXVxuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXFVLFNBQVMsZUFBZTtBQUU3VixPQUFPLFdBQVc7QUFDbEIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sd0JBQXdCOzs7QUNML0I7QUFBQSxFQUNFLE1BQVE7QUFBQSxFQUNSLFNBQVc7QUFBQSxFQUNYLFNBQVc7QUFBQSxFQUNY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
