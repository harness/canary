import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const target = process.env.FIGMA_BUILD ?? "ui";

export default defineConfig(
  target === "main"
    ? {
        root,
        build: {
          outDir: "dist",
          emptyOutDir: false,
          target: "es2017",
          lib: {
            entry: path.resolve(root, "src/main.ts"),
            formats: ["iife"],
            name: "dsContractsMain",
            fileName: () => "main.js",
          },
          minify: false,
        },
      }
    : {
        root: path.resolve(root, "src"),
        plugins: [preact(), viteSingleFile()],
        build: {
          outDir: path.resolve(root, "dist"),
          emptyOutDir: true,
          target: "es2017",
          rollupOptions: {
            input: path.resolve(root, "src/ui.html"),
            output: {
              entryFileNames: "assets/[name].js",
              assetFileNames: "assets/[name][extname]",
            },
          },
          assetsInlineLimit: 100_000_000,
          cssCodeSplit: false,
          minify: true,
        },
      },
);
