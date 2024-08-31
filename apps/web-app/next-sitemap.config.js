//https://www.npmjs.com/package/next-sitemap

module.exports = {
  siteUrl: process.env.HOST_NAME || 'https://thenextstartup.erehwonmi.com',
  generateRobotsTxt: true,
  exclude: ['/twitter-image.*', '/opengraph-image.*', '/icon.*'],
  sourceDir: './apps/web-app/.next',
  outDir: './apps/web-app/public',
};
