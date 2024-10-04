/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: [
			'fsa.bo',
			'farmacorp.com',
			'hebmx.vtexassets.com',
			'www.rujamar.com',
		],
	},
	async rewrites() {
		return [
			{
				source: '/sln.js',
				destination: 'https://cdn.seline.so/seline.js',
			},
			{
				source: '/_sln/:path*',
				destination: 'https://api.seline.so/:path*',
			},
		]
	},
}

export default nextConfig;
