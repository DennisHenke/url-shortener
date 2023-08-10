import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const path = fileURLToPath(new URL(import.meta.url));
const root = resolve(dirname(path), "src/client");

// https://vitejs.dev/config/
export default defineConfig({
  //  server: {
  //    middlewareMode: true,
  //  },
  root: root,
  plugins: [react()],
});
