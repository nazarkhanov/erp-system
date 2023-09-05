import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@/": `${path.resolve(__dirname, "client")}/`,
		},
	},
	server: {
		host: "ui",
		port: "3000",
		proxy: {
			"/api": `http://api:8000`,
		},
	},
});
