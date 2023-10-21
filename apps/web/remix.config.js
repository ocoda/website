/** @type {import('@remix-run/dev').AppConfig} */
export default {
	appDirectory: 'src',
	ignoredRouteFiles: ['**/.*'],
	assetsBuildDirectory: 'build/public/assets',
	publicPath: '/assets',
	serverBuildPath: 'build/server/index.js',
	serverPlatform: 'node',
};
