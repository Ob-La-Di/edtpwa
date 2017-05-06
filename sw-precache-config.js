module.exports = {
  staticFileGlobs: [
    '/index.html',
    '/manifest.json',
    '/bower_components/webcomponentsjs/webcomponents-lite.js',
    '/bower_components/moment/min/moment.min.js',
    '/bower_components/moment/locale/fr.js'
  ],
  navigateFallback: '/index.html',
  navigateFallbackWhitelist: [/^(?!.*\.html$|\/data\/).*/],
  runtimeCaching: [
    {
      urlPattern: '/edt',///^https:\/\/i\.ytimg\.com/,
      handler: 'networkFirst',
      options: {
        cache: {
          maxEntries: 100,
          name: 'yt-images-cache'
        }
      }
    }
  ]
};
