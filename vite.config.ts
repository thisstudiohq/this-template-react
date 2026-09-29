import netlify from "@netlify/vite-plugin-tanstack-start";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

function glslPlugin() {
	return {
		name: "vite-plugin-glsl-raw",
		transform(code: string, id: string) {
			if (id.endsWith(".glsl")) {
				return {
					code: `export default ${JSON.stringify(code)};`,
					map: { mappings: "" },
				};
			}
		},
	};
}

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	server: {
		proxy: {
			"/studio": {
				target: "http://localhost:3333",
				changeOrigin: true,
				ws: true,
			},
			"/static": {
				target: "http://localhost:3333",
				changeOrigin: true,
			},
		},
	},
	environments: {
		ssr: {
			resolve: {
				noExternal: ["gsap", "lenis", "ogl", "three"],
			},
		},
	},
	css: {
		preprocessorOptions: {
			scss: {},
		},
	},
	plugins: [glslPlugin(), devtools(), netlify(), tailwindcss(), tanstackStart(), viteReact()],
});

export default config;
