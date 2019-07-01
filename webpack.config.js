const path = require('path');

var aframe = path.join(__dirname, '/node_modules/aframe/dist/aframe-v0.9.2.min.js');

module.exports = {
  entry: {
    vendor: [aframe],
    main: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true
  }
};
