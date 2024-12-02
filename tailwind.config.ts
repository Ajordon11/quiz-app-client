import type { Config } from "tailwindcss";
import plugin from "flowbite/plugin";

const config: Config = {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
	"./node_modules/flowbite-svelte-icons/**/*.{html,js,svelte,ts}",
  ],

  theme: {
    extend: {
      colors: {
        // gray-700
        primary: "#374151",
        // indigo-950
        background: "#1e1b4b",
        // purple-900
        secondary: "#581c87",
		// gray-400
		tertiary: "#9ca3af"
      },
    },
  },

  plugins: [plugin],
  darkMode: "class",
};

export default config;
