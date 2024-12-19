import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"], // CommonJS and ES Modules
  dts: true, // Generate TypeScript declaration files
  splitting: false, // Disable code splitting
  sourcemap: true, // Generate sourcemaps
  clean: true, // Clean output directory
});