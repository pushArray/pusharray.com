var webpackConfig = require('./webpack.config');

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai', 'sinon'],
    files: ['static/test/**/*_spec.ts'],
    exclude: [
    ],
    preprocessors: {
      'static/test/**/*.ts': ['webpack']
    },
    webpack: {
      module: webpackConfig.module,
      resolve: webpackConfig.resolve
    },
    webpackMiddleware: {
      noInfo: true
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: true,
    concurrency: Infinity
  });
}
