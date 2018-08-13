module.exports = function(config) {
  config.set({
    basePath: '',
    browsers: ['PhantomJS'],
    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      './spec/**/*.spec.js'
    ],
    preprocessors: {
      './spec/**/*.js': ['webpack']
    },
    frameworks: ['jasmine'],
    webpack: {
      mode: 'development',
      module: {
        rules: [
          { test: /\.js/, exclude: /node_modules/, loader: 'babel-loader' }
        ]
      },
      watch: true
    },
    webpackServer: {
      noInfo: true
    }
  });
};
