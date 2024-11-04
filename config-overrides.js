const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "fs": false,
    "net": false,
    "tls": false,
    "child_process": false,
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "stream": require.resolve("stream-browserify"),
    "crypto": require.resolve("crypto-browserify"),
    "zlib": require.resolve("browserify-zlib"),
    "path": require.resolve("path-browserify"),
    "url": require.resolve("url/"),
    "util": require.resolve("util/"),
    "assert": require.resolve("assert/"),
    "buffer": require.resolve("buffer/"),
    "process": require.resolve("process/browser")
  };

  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  ];

  config.resolve.alias = {
    ...config.resolve.alias,
    'engine.io-client/globalThis': 'engine.io-client/build/cjs/globalThis.browser.js'
  };

  return config;
}; 