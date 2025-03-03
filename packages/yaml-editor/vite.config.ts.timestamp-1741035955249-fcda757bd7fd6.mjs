var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// package.json
var require_package = __commonJS({
  "package.json"(exports, module) {
    module.exports = {
      name: "@harnessio/yaml-editor",
      version: "0.15.0",
      private: false,
      author: "Harness Inc.",
      license: "Apache-2.0",
      type: "module",
      module: "./dist/index.js",
      main: "./dist/index.js",
      files: [
        "dist"
      ],
      types: "./dist/index.d.ts",
      scripts: {
        dev: "vite build --watch",
        webpack: "webpack",
        build: "vite build",
        "build:ci": "vite build",
        "build:watch": "vite build --watch",
        prepublishOnly: "pnpm build",
        pretty: "prettier --check ./src",
        lint: "eslint ./src",
        "pre-commit": "lint-staged",
        playground: "vite dev --config vite.config.playground.ts"
      },
      peerDependencies: {
        "@monaco-editor/react": "4.6.0",
        "monaco-editor": "^0.40.0",
        "monaco-yaml": "^4.0.4",
        react: "^17.0.2",
        "react-dom": "^17.0.2"
      },
      devDependencies: {
        "@babel/core": "^7.24.7",
        "@babel/preset-env": "^7.24.7",
        "@babel/preset-react": "^7.24.7",
        "@babel/preset-typescript": "^7.24.7",
        "@testing-library/jest-dom": "^5.17.0",
        "@testing-library/react": "^12.1.5",
        "@testing-library/user-event": "^13.5.0",
        "@types/jest": "^27.5.2",
        "@types/node": "^16.18.101",
        "@types/react": "^17.0.3",
        "@types/react-dom": "^17.0.3",
        "@vitejs/plugin-react": "^4.0.4",
        "@vitejs/plugin-react-swc": "^3.5.0",
        "babel-loader": "^9.1.3",
        "babel-plugin-syntax-dynamic-import": "^6.18.0",
        "babel-plugin-transform-class-properties": "^6.24.1",
        "babel-plugin-transform-es2015-modules-commonjs": "^6.26.2",
        "css-loader": "^7.1.2",
        "file-loader": "^6.2.0",
        "html-webpack-plugin": "^5.6.0",
        "lint-staged": "^15.2.9",
        "mini-css-extract-plugin": "^2.9.0",
        "monaco-editor-webpack-plugin": "^7.1.0",
        "sass-loader": "^14.2.1",
        "style-loader": "^4.0.0",
        "ts-loader": "^9.5.1",
        typescript: "^4.9.5",
        "url-loader": "^4.1.1",
        vite: "^4.4.9",
        "vite-plugin-dts": "^3.9.1",
        "vite-plugin-monaco-editor": "^1.1.0",
        watch: "^1.0.2",
        webpack: "^5.92.1",
        "webpack-cli": "^5.1.4",
        "webpack-dev-server": "^5.0.4"
      },
      "lint-staged": {
        "*.{js,jsx,ts,tsx}": [
          "eslint ./src --fix",
          "prettier ./src --write"
        ]
      }
    };
  }
});

// vite.config.ts
import { resolve } from "path";
import react from "file:///Users/c_sanskarsehgal/Desktop/canary/node_modules/.pnpm/@vitejs+plugin-react-swc@3.7.2_vite@4.5.9_@types+node@16.18.125_sass@1.83.4_terser@5.37.0_/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { defineConfig } from "file:///Users/c_sanskarsehgal/Desktop/canary/node_modules/.pnpm/vite@4.5.9_@types+node@16.18.125_sass@1.83.4_terser@5.37.0/node_modules/vite/dist/node/index.js";
import dts from "file:///Users/c_sanskarsehgal/Desktop/canary/node_modules/.pnpm/vite-plugin-dts@3.9.1_@types+node@16.18.125_rollup@4.32.0_typescript@4.9.5_vite@4.5.9_@types+_eqqnrh2ubgv4t3fixfvolzfyre/node_modules/vite-plugin-dts/dist/index.mjs";
import monacoEditorPlugin from "file:///Users/c_sanskarsehgal/Desktop/canary/node_modules/.pnpm/vite-plugin-monaco-editor@1.1.0_monaco-editor@0.40.0/node_modules/vite-plugin-monaco-editor/dist/index.js";
var __vite_injected_original_dirname = "/Users/c_sanskarsehgal/Desktop/canary/packages/yaml-editor";
var pkg = require_package();
var external = Object.keys(pkg.devDependencies || []).concat(Object.keys(pkg.peerDependencies || [])).concat(Object.keys(pkg.peerDependencies || [])).concat([
  "monaco-editor/esm/vs/editor/standalone/browser/standaloneServices.js",
  "monaco-editor/esm/vs/editor/standalone/browser/outlineModel.js",
  "monaco-editor/esm/vs/editor/standalone/browser/ILanguageFeaturesService.js"
]);
var vite_config_default = defineConfig({
  define: { "process.env.NODE_ENV": '"production"' },
  plugins: [
    react(),
    dts({
      outDir: "dist",
      tsconfigPath: "./tsconfig.json"
    }),
    monacoEditorPlugin.default({ customWorkers: [{ entry: "monaco-yaml/yaml.worker", label: "yaml" }] })
  ],
  build: {
    sourcemap: true,
    copyPublicDir: false,
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "yaml-editor",
      fileName: "index",
      formats: ["es"]
    },
    rollupOptions: { external }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFja2FnZS5qc29uIiwgInZpdGUuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJ7XG4gIFwibmFtZVwiOiBcIkBoYXJuZXNzaW8veWFtbC1lZGl0b3JcIixcbiAgXCJ2ZXJzaW9uXCI6IFwiMC4xNS4wXCIsXG4gIFwicHJpdmF0ZVwiOiBmYWxzZSxcbiAgXCJhdXRob3JcIjogXCJIYXJuZXNzIEluYy5cIixcbiAgXCJsaWNlbnNlXCI6IFwiQXBhY2hlLTIuMFwiLFxuICBcInR5cGVcIjogXCJtb2R1bGVcIixcbiAgXCJtb2R1bGVcIjogXCIuL2Rpc3QvaW5kZXguanNcIixcbiAgXCJtYWluXCI6IFwiLi9kaXN0L2luZGV4LmpzXCIsXG4gIFwiZmlsZXNcIjogW1xuICAgIFwiZGlzdFwiXG4gIF0sXG4gIFwidHlwZXNcIjogXCIuL2Rpc3QvaW5kZXguZC50c1wiLFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwiZGV2XCI6IFwidml0ZSBidWlsZCAtLXdhdGNoXCIsXG4gICAgXCJ3ZWJwYWNrXCI6IFwid2VicGFja1wiLFxuICAgIFwiYnVpbGRcIjogXCJ2aXRlIGJ1aWxkXCIsXG4gICAgXCJidWlsZDpjaVwiOiBcInZpdGUgYnVpbGRcIixcbiAgICBcImJ1aWxkOndhdGNoXCI6IFwidml0ZSBidWlsZCAtLXdhdGNoXCIsXG4gICAgXCJwcmVwdWJsaXNoT25seVwiOiBcInBucG0gYnVpbGRcIixcbiAgICBcInByZXR0eVwiOiBcInByZXR0aWVyIC0tY2hlY2sgLi9zcmNcIixcbiAgICBcImxpbnRcIjogXCJlc2xpbnQgLi9zcmNcIixcbiAgICBcInByZS1jb21taXRcIjogXCJsaW50LXN0YWdlZFwiLFxuICAgIFwicGxheWdyb3VuZFwiOiBcInZpdGUgZGV2IC0tY29uZmlnIHZpdGUuY29uZmlnLnBsYXlncm91bmQudHNcIlxuICB9LFxuICBcInBlZXJEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQG1vbmFjby1lZGl0b3IvcmVhY3RcIjogXCI0LjYuMFwiLFxuICAgIFwibW9uYWNvLWVkaXRvclwiOiBcIl4wLjQwLjBcIixcbiAgICBcIm1vbmFjby15YW1sXCI6IFwiXjQuMC40XCIsXG4gICAgXCJyZWFjdFwiOiBcIl4xNy4wLjJcIixcbiAgICBcInJlYWN0LWRvbVwiOiBcIl4xNy4wLjJcIlxuICB9LFxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAYmFiZWwvY29yZVwiOiBcIl43LjI0LjdcIixcbiAgICBcIkBiYWJlbC9wcmVzZXQtZW52XCI6IFwiXjcuMjQuN1wiLFxuICAgIFwiQGJhYmVsL3ByZXNldC1yZWFjdFwiOiBcIl43LjI0LjdcIixcbiAgICBcIkBiYWJlbC9wcmVzZXQtdHlwZXNjcmlwdFwiOiBcIl43LjI0LjdcIixcbiAgICBcIkB0ZXN0aW5nLWxpYnJhcnkvamVzdC1kb21cIjogXCJeNS4xNy4wXCIsXG4gICAgXCJAdGVzdGluZy1saWJyYXJ5L3JlYWN0XCI6IFwiXjEyLjEuNVwiLFxuICAgIFwiQHRlc3RpbmctbGlicmFyeS91c2VyLWV2ZW50XCI6IFwiXjEzLjUuMFwiLFxuICAgIFwiQHR5cGVzL2plc3RcIjogXCJeMjcuNS4yXCIsXG4gICAgXCJAdHlwZXMvbm9kZVwiOiBcIl4xNi4xOC4xMDFcIixcbiAgICBcIkB0eXBlcy9yZWFjdFwiOiBcIl4xNy4wLjNcIixcbiAgICBcIkB0eXBlcy9yZWFjdC1kb21cIjogXCJeMTcuMC4zXCIsXG4gICAgXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiOiBcIl40LjAuNFwiLFxuICAgIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3Qtc3djXCI6IFwiXjMuNS4wXCIsXG4gICAgXCJiYWJlbC1sb2FkZXJcIjogXCJeOS4xLjNcIixcbiAgICBcImJhYmVsLXBsdWdpbi1zeW50YXgtZHluYW1pYy1pbXBvcnRcIjogXCJeNi4xOC4wXCIsXG4gICAgXCJiYWJlbC1wbHVnaW4tdHJhbnNmb3JtLWNsYXNzLXByb3BlcnRpZXNcIjogXCJeNi4yNC4xXCIsXG4gICAgXCJiYWJlbC1wbHVnaW4tdHJhbnNmb3JtLWVzMjAxNS1tb2R1bGVzLWNvbW1vbmpzXCI6IFwiXjYuMjYuMlwiLFxuICAgIFwiY3NzLWxvYWRlclwiOiBcIl43LjEuMlwiLFxuICAgIFwiZmlsZS1sb2FkZXJcIjogXCJeNi4yLjBcIixcbiAgICBcImh0bWwtd2VicGFjay1wbHVnaW5cIjogXCJeNS42LjBcIixcbiAgICBcImxpbnQtc3RhZ2VkXCI6IFwiXjE1LjIuOVwiLFxuICAgIFwibWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cIjogXCJeMi45LjBcIixcbiAgICBcIm1vbmFjby1lZGl0b3Itd2VicGFjay1wbHVnaW5cIjogXCJeNy4xLjBcIixcbiAgICBcInNhc3MtbG9hZGVyXCI6IFwiXjE0LjIuMVwiLFxuICAgIFwic3R5bGUtbG9hZGVyXCI6IFwiXjQuMC4wXCIsXG4gICAgXCJ0cy1sb2FkZXJcIjogXCJeOS41LjFcIixcbiAgICBcInR5cGVzY3JpcHRcIjogXCJeNC45LjVcIixcbiAgICBcInVybC1sb2FkZXJcIjogXCJeNC4xLjFcIixcbiAgICBcInZpdGVcIjogXCJeNC40LjlcIixcbiAgICBcInZpdGUtcGx1Z2luLWR0c1wiOiBcIl4zLjkuMVwiLFxuICAgIFwidml0ZS1wbHVnaW4tbW9uYWNvLWVkaXRvclwiOiBcIl4xLjEuMFwiLFxuICAgIFwid2F0Y2hcIjogXCJeMS4wLjJcIixcbiAgICBcIndlYnBhY2tcIjogXCJeNS45Mi4xXCIsXG4gICAgXCJ3ZWJwYWNrLWNsaVwiOiBcIl41LjEuNFwiLFxuICAgIFwid2VicGFjay1kZXYtc2VydmVyXCI6IFwiXjUuMC40XCJcbiAgfSxcbiAgXCJsaW50LXN0YWdlZFwiOiB7XG4gICAgXCIqLntqcyxqc3gsdHMsdHN4fVwiOiBbXG4gICAgICBcImVzbGludCAuL3NyYyAtLWZpeFwiLFxuICAgICAgXCJwcmV0dGllciAuL3NyYyAtLXdyaXRlXCJcbiAgICBdXG4gIH1cbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2Nfc2Fuc2thcnNlaGdhbC9EZXNrdG9wL2NhbmFyeS9wYWNrYWdlcy95YW1sLWVkaXRvclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2Nfc2Fuc2thcnNlaGdhbC9EZXNrdG9wL2NhbmFyeS9wYWNrYWdlcy95YW1sLWVkaXRvci92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvY19zYW5za2Fyc2VoZ2FsL0Rlc2t0b3AvY2FuYXJ5L3BhY2thZ2VzL3lhbWwtZWRpdG9yL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXG5cbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2MnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IGR0cyBmcm9tICd2aXRlLXBsdWdpbi1kdHMnXG5pbXBvcnQgbW9uYWNvRWRpdG9yUGx1Z2luIGZyb20gJ3ZpdGUtcGx1Z2luLW1vbmFjby1lZGl0b3InXG5cbmNvbnN0IHBrZyA9IHJlcXVpcmUoJy4vcGFja2FnZS5qc29uJylcblxuY29uc3QgZXh0ZXJuYWwgPSBPYmplY3Qua2V5cyhwa2cuZGV2RGVwZW5kZW5jaWVzIHx8IFtdKVxuICAuY29uY2F0KE9iamVjdC5rZXlzKHBrZy5wZWVyRGVwZW5kZW5jaWVzIHx8IFtdKSlcbiAgLmNvbmNhdChPYmplY3Qua2V5cyhwa2cucGVlckRlcGVuZGVuY2llcyB8fCBbXSkpXG4gIC5jb25jYXQoW1xuICAgICdtb25hY28tZWRpdG9yL2VzbS92cy9lZGl0b3Ivc3RhbmRhbG9uZS9icm93c2VyL3N0YW5kYWxvbmVTZXJ2aWNlcy5qcycsXG4gICAgJ21vbmFjby1lZGl0b3IvZXNtL3ZzL2VkaXRvci9zdGFuZGFsb25lL2Jyb3dzZXIvb3V0bGluZU1vZGVsLmpzJyxcbiAgICAnbW9uYWNvLWVkaXRvci9lc20vdnMvZWRpdG9yL3N0YW5kYWxvbmUvYnJvd3Nlci9JTGFuZ3VhZ2VGZWF0dXJlc1NlcnZpY2UuanMnXG4gIF0pXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGRlZmluZTogeyAncHJvY2Vzcy5lbnYuTk9ERV9FTlYnOiAnXCJwcm9kdWN0aW9uXCInIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIGR0cyh7XG4gICAgICBvdXREaXI6ICdkaXN0JyxcbiAgICAgIHRzY29uZmlnUGF0aDogJy4vdHNjb25maWcuanNvbidcbiAgICB9KSxcbiAgICBtb25hY29FZGl0b3JQbHVnaW4uZGVmYXVsdCh7IGN1c3RvbVdvcmtlcnM6IFt7IGVudHJ5OiAnbW9uYWNvLXlhbWwveWFtbC53b3JrZXInLCBsYWJlbDogJ3lhbWwnIH1dIH0pXG4gIF0sXG4gIGJ1aWxkOiB7XG4gICAgc291cmNlbWFwOiB0cnVlLFxuICAgIGNvcHlQdWJsaWNEaXI6IGZhbHNlLFxuICAgIGxpYjoge1xuICAgICAgZW50cnk6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2luZGV4LnRzJyksXG4gICAgICBuYW1lOiAneWFtbC1lZGl0b3InLFxuICAgICAgZmlsZU5hbWU6ICdpbmRleCcsXG4gICAgICBmb3JtYXRzOiBbJ2VzJ11cbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHsgZXh0ZXJuYWwgfVxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUEsTUFDRSxNQUFRO0FBQUEsTUFDUixTQUFXO0FBQUEsTUFDWCxTQUFXO0FBQUEsTUFDWCxRQUFVO0FBQUEsTUFDVixTQUFXO0FBQUEsTUFDWCxNQUFRO0FBQUEsTUFDUixRQUFVO0FBQUEsTUFDVixNQUFRO0FBQUEsTUFDUixPQUFTO0FBQUEsUUFDUDtBQUFBLE1BQ0Y7QUFBQSxNQUNBLE9BQVM7QUFBQSxNQUNULFNBQVc7QUFBQSxRQUNULEtBQU87QUFBQSxRQUNQLFNBQVc7QUFB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
