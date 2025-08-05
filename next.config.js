/** @type {import('next').NextConfig} */
const nextConfig = {
	// Enable standalone output for Docker optimization
	output: 'standalone',
	
	images: {
		domains: ['firebasestorage.googleapis.com'],
	},
	
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	},

	// Optimize for production
	experimental: {
		// Enable SWC minify for better performance
		swcMinify: true,
	},
}

module.exports = nextConfig
