import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [
		react({
			babel: {
				plugins: [
					[
						"babel-plugin-react-compiler",
						{
							target: "19",
						},
					],
				],
			},
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	server: {
		host: true,
		port: 5173,
		strictPort: true,
		open: true,
	},
	build: {
		outDir: "dist",
		sourcemap: process.env.NODE_ENV === "development",
		minify: "lightningcss",
		cssMinify: true,
		chunkSizeWarningLimit: 600,
	},
	optimizeDeps: {
		include: ["react", "react-dom", "react-router-dom"],
	},
});
