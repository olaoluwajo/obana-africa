import type { Config } from "tailwindcss";

const config: Config = {
	content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		extend: {
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					hover: "hsl(var(--primary-foreground))",
				},
				obBlue: {
					"700": "#3874B8",
					"800": "#1B3B5F",
				},
			},
		},
	},
	plugins: [],
};
export default config;
