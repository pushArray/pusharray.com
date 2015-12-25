module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: './',

    preprocessors: {
      'static/js/spec/**/*.spec.js': ['browserify']
    },

    // frameworks to use
    frameworks: [
      'browserify',
      'jasmine'
    ],

    browserify: {
      debug: true,
      transform: [
        'babelify',
        'browserify-istanbul'
      ]
    },

    // list of files / patterns to load in the browser
    files: [
      'static/js/spec/**/*.spec.js'
    ],

    // test results reporter to use
    reporters: [
      'progress',
      'coverage'
    ],

    coverageReporter: {
      'reporters': [
        {
          type: 'text'
        }, {
          type: 'text-summary'
        }
      ]
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // Start these browsers
    browsers: ['PhantomJS'],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
