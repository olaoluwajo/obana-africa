const path = require('path');

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
				hostname: "utfs.io",
				port: "",
			},
			{
				protocol: "https",
				hostname: "api.slingacademy.com",
				port: "",
			},
		],
	},
	transpilePackages: ["geist"],
};

module.exports = nextConfig;
