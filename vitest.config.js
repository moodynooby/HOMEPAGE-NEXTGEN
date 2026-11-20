import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: [{ find: "@", replacement: path.resolve(__dirname, "./src") }],
	},
	test: {
		environment: "happy-dom",
		globals: true,
		testTimeout: 15000,
		setupFiles: ["./src/test/setup.js"],
		include: ["src/**/*.test.{js,jsx}"],
	},
});
