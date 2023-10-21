/** @type {import('@remix-run/dev').AppConfig} */
export default {
	appDirectory: 'src',
	ignoredRouteFiles: ['**/.*'],
	assetsBuildDirectory: 'build/public',
	publicPath: '/public',
	serverBuildPath: 'build/server/index.js',
	serverPlatform: 'node',
};
