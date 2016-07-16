module.exports = {
  devtool: 'inline-source-map',
  entry: {
    p5: './static/src/main.ts'
  },
  output: {
    path: __dirname + '/static/bin',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
  module: {
    loaders: [{
      test: /\.tsx?$/,
      exclude: /(node_modules)/,
      loader: 'ts'
    }]
  }
};
