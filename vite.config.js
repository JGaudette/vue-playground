import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import yaml from "@rollup/plugin-yaml";

const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), yaml()],
  alias: [{ find: "@", replacement: path.resolve(__dirname, "src") }],
  define: {
    "process.env": process.env,
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/_variables.scss";`,
        url: true,
      },
    },
  },
  server: {
    watch: {
      usePolling: true,
    },
  },
});
