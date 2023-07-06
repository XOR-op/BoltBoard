import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	base: "./",
	build: { outDir: "../src-tauri/dist/tray-menu" },
	plugins: [react()]
});
