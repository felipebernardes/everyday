const path = require('path');

module.exports = {
  entry: {
    main: './src/index.js',
  }
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  devtool: 'source-map'
};
