var Path = require('path');

module.exports = function(config) {
  config.set({
    port: 9876,
    logLevel: config.LOG_WARNING,
    autoWatch: true,
    singleRun: false,
    browsers: [ 'Chrome' ],
    frameworks: [ 'chai', 'mocha' ],
    files: [
      'tests.bundle.js',
    ],
    client: {
      args: parseTestPattern(process.argv),
    },
    preprocessors: {
      'tests.bundle.js': [ 'webpack', 'sourcemap' ]
    },
    middleware: [ 'surpassImageRequests' ],
    plugins: [
      'karma-chai',
      'karma-chrome-launcher',
      'karma-mocha',
      'karma-sourcemap-loader',
      'karma-webpack',
      { 'middleware:surpassImageRequests': ['value', surpassImageRequests] },
    ],
    reporters: [ 'progress' ],

    webpack: {
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            loader: 'babel-loader',
            exclude: Path.resolve('./node_modules'),
            query: {
              presets: [
                '@babel/env',
                '@babel/react',
              ],
              plugins: [
                '@babel/transform-runtime',
              ]
            }
          },
          {
            test: /\.(txt|md|html)$/i,
            use: 'raw-loader',
          },
        ]
      },
    },

    webpackMiddleware: {
      noInfo: true,
    },
  })
};

function parseTestPattern(argv) {
  var index = argv.indexOf('--');
  var patterns = (index !== -1) ? argv.slice(index + 1) : [];
  if (patterns.length > 0) {
    return [ '--grep' ].concat(patterns);
  } else {
    return [];
  }
}

function surpassImageRequests(req, res, next) {
  if (/\bimage\b/.test(req.headers.accept)) {
    res.writeHead(204, {});
    return res.end();
  }
  next();
}
