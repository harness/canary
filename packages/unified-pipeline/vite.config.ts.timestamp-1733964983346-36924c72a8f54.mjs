var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// package.json
var require_package = __commonJS({
  "package.json"(exports, module) {
    module.exports = {
      name: "@harnessio/unified-pipeline",
      version: "0.2.0",
      description: "Harness Unified Pipeline library",
      scripts: {
        dev: "run-p typed-scss build:watch",
        "build:css": "npx tailwindcss -i ./src/styles.css -o ./public/styles.css",
        build: "vite build",
        "build:watch": "vite build --watch",
        pretty: "prettier --check ./src",
        lint: "eslint ./src",
        "typed-scss": "typed-scss-modules src --watch",
        prepublishOnly: "pnpm build",
        "pre-commit": "lint-staged"
      },
      private: false,
      type: "module",
      module: "./dist/index.js",
      main: "./dist/index.js",
      files: [
        "dist"
      ],
      types: "./dist/index.d.ts",
      exports: {
        ".": {
          import: "./dist/index.js"
        },
        "./tailwind.config": "./tailwind.config.js",
        "./styles": "./dist/style.css"
      },
      style: "./dist/style.css",
      repository: {
        type: "git",
        url: "git+https://github.com/harness/canary/tree/main/packages/unified-pipeline"
      },
      bugs: {
        url: "https://github.com/harness/canary/issues"
      },
      license: "Apache-2.0",
      dependencies: {
        "@harnessio/canary": "workspace:*",
        classnames: "^2.5.1",
        dagre: "^0.8.5",
        elkjs: "^0.9.3",
        "lodash-es": "^4.17.21",
        react: "^18.2.0",
        "react-dom": "^18.2.0",
        reactflow: "^11.11.4",
        tailwindcss: "^3.4.4",
        "web-worker": "^1.0.0",
        zustand: "^4.5.4"
      },
      devDependencies: {
        "@modyfi/vite-plugin-yaml": "^1.1.0",
        "@types/classnames": "^2.3.1",
        "@types/dagre": "^0.7.52",
        "@types/lodash-es": "^4.17.12",
        "@types/node": "^22.2.0",
        "@types/react": "^18.3.3",
        "@types/react-copy-to-clipboard": "^5.0.7",
        "@types/react-dom": "^18.2.0",
        "@vitejs/plugin-react-swc": "^3.7.2",
        "dts-bundle-generator": "^6.4.0",
        "lint-staged": "^15.2.9",
        "npm-run-all": "^4.1.5",
        sass: "^1.32.8",
        "typed-scss-modules": "^7.1.4",
        typescript: "^5.3.3",
        vite: "^6.0.3",
        "vite-plugin-dts": "^4.3.0",
        "vite-plugin-svgr": "^4.3.0"
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
import ViteYaml from "file:///Users/c_sanskarsehgal/Desktop/canary/node_modules/.pnpm/@modyfi+vite-plugin-yaml@1.1.0_rollup@4.28.0_vite@5.3.1_@types+node@22.2.0_sass@1.77.8_terser@5.31.3_/node_modules/@modyfi/vite-plugin-yaml/dist/index.js";
import react from "file:///Users/c_sanskarsehgal/Desktop/canary/node_modules/.pnpm/@vitejs+plugin-react-swc@3.7.0_@swc+helpers@0.5.2_vite@5.3.1_@types+node@22.2.0_sass@1.77.8_terser@5.31.3_/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { uniq } from "file:///Users/c_sanskarsehgal/Desktop/canary/node_modules/.pnpm/lodash-es@4.17.21/node_modules/lodash-es/lodash.js";
import { defineConfig } from "file:///Users/c_sanskarsehgal/Desktop/canary/node_modules/.pnpm/vite@5.3.1_@types+node@22.2.0_sass@1.77.8_terser@5.31.3/node_modules/vite/dist/node/index.js";
import dts from "file:///Users/c_sanskarsehgal/Desktop/canary/node_modules/.pnpm/vite-plugin-dts@3.9.1_@types+node@22.2.0_rollup@4.28.0_typescript@5.5.3_vite@5.3.1_@types+nod_zpdvoc6rnb7dkuecy3xssu7roi/node_modules/vite-plugin-dts/dist/index.mjs";
import svgr from "file:///Users/c_sanskarsehgal/Desktop/canary/node_modules/.pnpm/vite-plugin-svgr@4.2.0_rollup@4.28.0_typescript@5.5.3_vite@5.3.1_@types+node@22.2.0_sass@1.77.8_terser@5.31.3_/node_modules/vite-plugin-svgr/dist/index.js";
var __vite_injected_original_dirname = "/Users/c_sanskarsehgal/Desktop/canary/packages/unified-pipeline";
var pkg = require_package();
var external = uniq(
  Object.keys(pkg.dependencies || []).concat(Object.keys(pkg.devDependencies || [])).concat(Object.keys(pkg.peerDependencies || [])).concat(["elkjs", "web-worker"])
);
var vite_config_default = defineConfig({
  define: { "process.env.NODE_ENV": '"production"' },
  plugins: [
    react(),
    dts({
      outDir: "dist",
      tsconfigPath: "./tsconfig.json"
      // beforeWriteFile: (filePath, content) => ({
      //   filePath: filePath.replace('src/', ''),
      //   content
      // })
    }),
    svgr(),
    ViteYaml()
  ],
  build: {
    sourcemap: true,
    copyPublicDir: false,
    lib: {
      entry: resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "unified-pipeline",
      fileName: "index",
      formats: ["es"]
    },
    rollupOptions: { external }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFja2FnZS5qc29uIiwgInZpdGUuY29uZmlnLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJ7XG4gIFwibmFtZVwiOiBcIkBoYXJuZXNzaW8vdW5pZmllZC1waXBlbGluZVwiLFxuICBcInZlcnNpb25cIjogXCIwLjIuMFwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiSGFybmVzcyBVbmlmaWVkIFBpcGVsaW5lIGxpYnJhcnlcIixcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcImRldlwiOiBcInJ1bi1wIHR5cGVkLXNjc3MgYnVpbGQ6d2F0Y2hcIixcbiAgICBcImJ1aWxkOmNzc1wiOiBcIm5weCB0YWlsd2luZGNzcyAtaSAuL3NyYy9zdHlsZXMuY3NzIC1vIC4vcHVibGljL3N0eWxlcy5jc3NcIixcbiAgICBcImJ1aWxkXCI6IFwidml0ZSBidWlsZFwiLFxuICAgIFwiYnVpbGQ6d2F0Y2hcIjogXCJ2aXRlIGJ1aWxkIC0td2F0Y2hcIixcbiAgICBcInByZXR0eVwiOiBcInByZXR0aWVyIC0tY2hlY2sgLi9zcmNcIixcbiAgICBcImxpbnRcIjogXCJlc2xpbnQgLi9zcmNcIixcbiAgICBcInR5cGVkLXNjc3NcIjogXCJ0eXBlZC1zY3NzLW1vZHVsZXMgc3JjIC0td2F0Y2hcIixcbiAgICBcInByZXB1Ymxpc2hPbmx5XCI6IFwicG5wbSBidWlsZFwiLFxuICAgIFwicHJlLWNvbW1pdFwiOiBcImxpbnQtc3RhZ2VkXCJcbiAgfSxcbiAgXCJwcml2YXRlXCI6IGZhbHNlLFxuICBcInR5cGVcIjogXCJtb2R1bGVcIixcbiAgXCJtb2R1bGVcIjogXCIuL2Rpc3QvaW5kZXguanNcIixcbiAgXCJtYWluXCI6IFwiLi9kaXN0L2luZGV4LmpzXCIsXG4gIFwiZmlsZXNcIjogW1xuICAgIFwiZGlzdFwiXG4gIF0sXG4gIFwidHlwZXNcIjogXCIuL2Rpc3QvaW5kZXguZC50c1wiLFxuICBcImV4cG9ydHNcIjoge1xuICAgIFwiLlwiOiB7XG4gICAgICBcImltcG9ydFwiOiBcIi4vZGlzdC9pbmRleC5qc1wiXG4gICAgfSxcbiAgICBcIi4vdGFpbHdpbmQuY29uZmlnXCI6IFwiLi90YWlsd2luZC5jb25maWcuanNcIixcbiAgICBcIi4vc3R5bGVzXCI6IFwiLi9kaXN0L3N0eWxlLmNzc1wiXG4gIH0sXG4gIFwic3R5bGVcIjogXCIuL2Rpc3Qvc3R5bGUuY3NzXCIsXG4gIFwicmVwb3NpdG9yeVwiOiB7XG4gICAgXCJ0eXBlXCI6IFwiZ2l0XCIsXG4gICAgXCJ1cmxcIjogXCJnaXQraHR0cHM6Ly9naXRodWIuY29tL2hhcm5lc3MvY2FuYXJ5L3RyZWUvbWFpbi9wYWNrYWdlcy91bmlmaWVkLXBpcGVsaW5lXCJcbiAgfSxcbiAgXCJidWdzXCI6IHtcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9oYXJuZXNzL2NhbmFyeS9pc3N1ZXNcIlxuICB9LFxuICBcImxpY2Vuc2VcIjogXCJBcGFjaGUtMi4wXCIsXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBoYXJuZXNzaW8vY2FuYXJ5XCI6IFwid29ya3NwYWNlOipcIixcbiAgICBcImNsYXNzbmFtZXNcIjogXCJeMi41LjFcIixcbiAgICBcImRhZ3JlXCI6IFwiXjAuOC41XCIsXG4gICAgXCJlbGtqc1wiOiBcIl4wLjkuM1wiLFxuICAgIFwibG9kYXNoLWVzXCI6IFwiXjQuMTcuMjFcIixcbiAgICBcInJlYWN0XCI6IFwiXjE4LjIuMFwiLFxuICAgIFwicmVhY3QtZG9tXCI6IFwiXjE4LjIuMFwiLFxuICAgIFwicmVhY3RmbG93XCI6IFwiXjExLjExLjRcIixcbiAgICBcInRhaWx3aW5kY3NzXCI6IFwiXjMuNC40XCIsXG4gICAgXCJ3ZWItd29ya2VyXCI6IFwiXjEuMC4wXCIsXG4gICAgXCJ6dXN0YW5kXCI6IFwiXjQuNS40XCJcbiAgfSxcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQG1vZHlmaS92aXRlLXBsdWdpbi15YW1sXCI6IFwiXjEuMS4wXCIsXG4gICAgXCJAdHlwZXMvY2xhc3NuYW1lc1wiOiBcIl4yLjMuMVwiLFxuICAgIFwiQHR5cGVzL2RhZ3JlXCI6IFwiXjAuNy41MlwiLFxuICAgIFwiQHR5cGVzL2xvZGFzaC1lc1wiOiBcIl40LjE3LjEyXCIsXG4gICAgXCJAdHlwZXMvbm9kZVwiOiBcIl4yMi4yLjBcIixcbiAgICBcIkB0eXBlcy9yZWFjdFwiOiBcIl4xOC4zLjNcIixcbiAgICBcIkB0eXBlcy9yZWFjdC1jb3B5LXRvLWNsaXBib2FyZFwiOiBcIl41LjAuN1wiLFxuICAgIFwiQHR5cGVzL3JlYWN0LWRvbVwiOiBcIl4xOC4yLjBcIixcbiAgICBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiOiBcIl4zLjcuMlwiLFxuICAgIFwiZHRzLWJ1bmRsZS1nZW5lcmF0b3JcIjogXCJeNi40LjBcIixcbiAgICBcImxpbnQtc3RhZ2VkXCI6IFwiXjE1LjIuOVwiLFxuICAgIFwibnBtLXJ1bi1hbGxcIjogXCJeNC4xLjVcIixcbiAgICBcInNhc3NcIjogXCJeMS4zMi44XCIsXG4gICAgXCJ0eXBlZC1zY3NzLW1vZHVsZXNcIjogXCJeNy4xLjRcIixcbiAgICBcInR5cGVzY3JpcHRcIjogXCJeNS4zLjNcIixcbiAgICBcInZpdGVcIjogXCJeNi4wLjNcIixcbiAgICBcInZpdGUtcGx1Z2luLWR0c1wiOiBcIl40LjMuMFwiLFxuICAgIFwidml0ZS1wbHVnaW4tc3ZnclwiOiBcIl40LjMuMFwiXG4gIH0sXG4gIFwibGludC1zdGFnZWRcIjoge1xuICAgIFwiKi57anMsanN4LHRzLHRzeH1cIjogW1xuICAgICAgXCJlc2xpbnQgLi9zcmMgLS1maXhcIixcbiAgICAgIFwicHJldHRpZXIgLi9zcmMgLS13cml0ZVwiXG4gICAgXVxuICB9XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9jX3NhbnNrYXJzZWhnYWwvRGVza3RvcC9jYW5hcnkvcGFja2FnZXMvdW5pZmllZC1waXBlbGluZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2Nfc2Fuc2thcnNlaGdhbC9EZXNrdG9wL2NhbmFyeS9wYWNrYWdlcy91bmlmaWVkLXBpcGVsaW5lL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9jX3NhbnNrYXJzZWhnYWwvRGVza3RvcC9jYW5hcnkvcGFja2FnZXMvdW5pZmllZC1waXBlbGluZS92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCBwYXRoLCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJ1xuXG5pbXBvcnQgVml0ZVlhbWwgZnJvbSAnQG1vZHlmaS92aXRlLXBsdWdpbi15YW1sJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0LXN3YydcbmltcG9ydCB7IHVuaXEgfSBmcm9tICdsb2Rhc2gtZXMnXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IGR0cyBmcm9tICd2aXRlLXBsdWdpbi1kdHMnXG5pbXBvcnQgc3ZnciBmcm9tICd2aXRlLXBsdWdpbi1zdmdyJ1xuXG5jb25zdCBwa2cgPSByZXF1aXJlKCcuL3BhY2thZ2UuanNvbicpXG5cbmNvbnN0IGV4dGVybmFsID0gdW5pcShcbiAgT2JqZWN0LmtleXMocGtnLmRlcGVuZGVuY2llcyB8fCBbXSlcbiAgICAuY29uY2F0KE9iamVjdC5rZXlzKHBrZy5kZXZEZXBlbmRlbmNpZXMgfHwgW10pKVxuICAgIC5jb25jYXQoT2JqZWN0LmtleXMocGtnLnBlZXJEZXBlbmRlbmNpZXMgfHwgW10pKVxuICAgIC5jb25jYXQoWydlbGtqcycsICd3ZWItd29ya2VyJ10pXG4pXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBkZWZpbmU6IHsgJ3Byb2Nlc3MuZW52Lk5PREVfRU5WJzogJ1wicHJvZHVjdGlvblwiJyB9LFxuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBkdHMoe1xuICAgICAgb3V0RGlyOiAnZGlzdCcsXG4gICAgICB0c2NvbmZpZ1BhdGg6ICcuL3RzY29uZmlnLmpzb24nXG4gICAgICAvLyBiZWZvcmVXcml0ZUZpbGU6IChmaWxlUGF0aCwgY29udGVudCkgPT4gKHtcbiAgICAgIC8vICAgZmlsZVBhdGg6IGZpbGVQYXRoLnJlcGxhY2UoJ3NyYy8nLCAnJyksXG4gICAgICAvLyAgIGNvbnRlbnRcbiAgICAgIC8vIH0pXG4gICAgfSksXG4gICAgc3ZncigpLFxuICAgIFZpdGVZYW1sKClcbiAgXSxcbiAgYnVpbGQ6IHtcbiAgICBzb3VyY2VtYXA6IHRydWUsXG4gICAgY29weVB1YmxpY0RpcjogZmFsc2UsXG4gICAgbGliOiB7XG4gICAgICBlbnRyeTogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvaW5kZXgudHMnKSxcbiAgICAgIG5hbWU6ICd1bmlmaWVkLXBpcGVsaW5lJyxcbiAgICAgIGZpbGVOYW1lOiAnaW5kZXgnLFxuICAgICAgZm9ybWF0czogWydlcyddXG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7IGV4dGVybmFsIH1cbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBLE1BQ0UsTUFBUTtBQUFBLE1BQ1IsU0FBVztBQUFBLE1BQ1gsYUFBZTtBQUFBLE1BQ2YsU0FBVztBQUFBLFFBQ1QsS0FBTztBQUFBLFFBQ1AsYUFBYTtBQUFBLFFBQ2IsT0FBUztBQUFBLFFBQ1QsZUFBZTtBQUFBLFFBQ2YsUUFBVTtBQUFBLFFBQ1YsTUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsZ0JBQWtCO0FBQUEsUUFDbEIsY0FBYztBQUFBLE1BQ2hCO0FBQUEsTUFDQSxTQUFXO0FBQUEsTUFDWCxNQUFRO0FBQUEsTUFDUixRQUFVO0FBQUEsTUFDVixNQUFRO0FBQUEsTUFDUixPQUFTO0FBQUEsUUFDUDtBQUFBLE1BQ0Y7QUFBQSxNQUNBLE9BQVM7QUFBQSxNQUNULFNBQVc7QUFBQSxRQUNULEtBQUs7QUFBQSxVQUNILFFBQVU7QUFBQSxRQUNaO0FBQUEsUUFDQSxxQkFBcUI7QUFBQSxRQUNyQixZQUFZO0FBQUEsTUFDZDtBQUFBLE1BQ0EsT0FBUztBQUFBLE1BQ1QsWUFBYztBQUFBLFFBQ1osTUFBUTtBQUFBLFFBQ1IsS0FBTztBQUFBLE1BQ1Q7QUFBQSxNQUNBLE1BQVE7QUFBQSxRQUNOLEtBQU87QUFBQSxNQUNUO0FBQUEsTUFDQSxTQUFXO0FBQUEsTUFDWCxjQUFnQjtBQUFBLFFBQ2QscUJBQXFCO0FBQUEsUUFDckIsWUFBYztBQUFBLFFBQ2QsT0FBUztBQUFBLFFBQ1QsT0FBUztBQUFBLFFBQ1QsYUFBYTtBQUFBLFFBQ2IsT0FBUztBQUFBLFFBQ1QsYUFBYTtBQUFBLFFBQ2IsV0FBYTtBQUFBLFFBQ2IsYUFBZTtBQUFBLFFBQ2YsY0FBYztBQUFBLFFBQ2QsU0FBVztBQUFBLE1BQ2I7QUFBQSxNQUNBLGlCQUFtQjtBQUFBLFFBQ2pCLDRCQUE0QjtBQUFBLFFBQzVCLHFCQUFxQjtBQUFBLFFBQ3JCLGdCQUFnQjtBQUFBLFFBQ2hCLG9CQUFvQjtBQUFBLFFBQ3BCLGVBQWU7QUFBQSxRQUNmLGdCQUFnQjtBQUFBLFFBQ2hCLGtDQUFrQztBQUFBLFFBQ2xDLG9CQUFvQjtBQUFBLFFBQ3BCLDRCQUE0QjtBQUFBLFFBQzVCLHdCQUF3QjtBQUFBLFFBQ3hCLGVBQWU7QUFBQSxRQUNmLGVBQWU7QUFBQSxRQUNmLE1BQVE7QUFBQSxRQUNSLHNCQUFzQjtBQUFBLFFBQ3RCLFlBQWM7QUFBQSxRQUNkLE1BQVE7QUFBQSxRQUNSLG1CQUFtQjtBQUFBLFFBQ25CLG9CQUFvQjtBQUFBLE1BQ3RCO0FBQUEsTUFDQSxlQUFlO0FBQUEsUUFDYixxQkFBcUI7QUFBQSxVQUNuQjtBQUFBLFVBQ0E7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQTtBQUFBOzs7QUM5RStXLFNBQWUsZUFBZTtBQUU3WSxPQUFPLGNBQWM7QUFDckIsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsWUFBWTtBQUNyQixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxVQUFVO0FBUGpCLElBQU0sbUNBQW1DO0FBU3pDLElBQU0sTUFBTTtBQUVaLElBQU0sV0FBVztBQUFBLEVBQ2YsT0FBTyxLQUFLLElBQUksZ0JBQWdCLENBQUMsQ0FBQyxFQUMvQixPQUFPLE9BQU8sS0FBSyxJQUFJLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxFQUM3QyxPQUFPLE9BQU8sS0FBSyxJQUFJLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxFQUM5QyxPQUFPLENBQUMsU0FBUyxZQUFZLENBQUM7QUFDbkM7QUFHQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixRQUFRLEVBQUUsd0JBQXdCLGVBQWU7QUFBQSxFQUNqRCxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixJQUFJO0FBQUEsTUFDRixRQUFRO0FBQUEsTUFDUixjQUFjO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtoQixDQUFDO0FBQUEsSUFDRCxLQUFLO0FBQUEsSUFDTCxTQUFTO0FBQUEsRUFDWDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsV0FBVztBQUFBLElBQ1gsZUFBZTtBQUFBLElBQ2YsS0FBSztBQUFBLE1BQ0gsT0FBTyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxNQUN4QyxNQUFNO0FBQUEsTUFDTixVQUFVO0FBQUEsTUFDVixTQUFTLENBQUMsSUFBSTtBQUFBLElBQ2hCO0FBQUEsSUFDQSxlQUFlLEVBQUUsU0FBUztBQUFBLEVBQzVCO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
