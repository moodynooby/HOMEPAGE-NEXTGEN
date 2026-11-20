import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: [
			{ find: "@", replacement: path.resolve(__dirname, "./src") },
			{
				find: "@mui/material/styles",
				replacement: path.resolve(__dirname, "./src/components/ui/styles.js"),
			},
			{
				find: "@mui/material",
				replacement: path.resolve(__dirname, "./src/components/ui/index.jsx"),
			},
			{
				find: /^@mui\/icons-material(\/.*)?$/,
				replacement: path.resolve(__dirname, "./src/components/ui/icons.jsx"),
			},
		],
	},
	test: {
		environment: "happy-dom",
		globals: true,
		setupFiles: ["./src/test/setup.js"],
		include: ["src/**/*.test.{js,jsx}"],
	},
});
