module.exports = {
  staticFileGlobs: [
    '/index.html',
    '/manifest.json',
    '/bower_components/webcomponentsjs/webcomponents-lite.js'
  ],
  navigateFallback: '/index.html',
  navigateFallbackWhitelist: [/^(?!.*\.html$|\/data\/).*/],
  runtimeCaching: [
    {
      urlPattern: '/edt',///^https:\/\/i\.ytimg\.com/,
      handler: 'fastest',
      options: {
        cache: {
          maxEntries: 100,
          name: 'yt-images-cache'
        }
      }
    }
  ]
};