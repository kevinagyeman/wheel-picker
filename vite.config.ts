import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	build: {
		lib: {
			entry: path.resolve(__dirname, "src/easy-picker.ts"),
			name: "EasyPicker",
			fileName: (format) => `easy-picker.${format === "es" ? "js" : "umd.js"}`,
			formats: ["es", "umd"],
		},
		rollupOptions: {
			external: [],
			output: {
				globals: {},
				assetFileNames: (assetInfo) => {
					if (assetInfo.name?.endsWith(".css")) return "style.css";
					return assetInfo.name || "";
				},
			},
		},
		cssCodeSplit: false,
	},
	plugins: [
		dts({
			include: ["src/easy-picker.ts"],
			rollupTypes: true,
		}),
	],
});
