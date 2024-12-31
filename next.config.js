const path = require("path");

const nextConfig = {
	webpack: (config) => {
		config.cache = {
			type: "filesystem",
			buildDependencies: {
				config: [__filename],
			},
		};

		return config;
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
				port: "",
			},
			{
				protocol: "https",
				hostname: "utfs.io",
				port: "",
			},
			{
				protocol: "https",
				hostname: "api.slingacademy.com",
				port: "",
			},
			{
				protocol: "https",
				hostname: "ng.jumia.is",
				port: "",
			},
		],
	},

	transpilePackages: ["geist"],
	redirects: async () => {
		return [];
	},
};

module.exports = nextConfig;
