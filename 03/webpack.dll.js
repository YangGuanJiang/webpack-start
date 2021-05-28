/* us dll to build some 3rd party lib
 default search in webpack.config.js, we need run webpack.all.js
*/

const { resolve } = require('path');
const Webpack = require('webpack'); // run: webpack --config webpack.dll.js

module.exports = {
  entry: {
    // create [name] -> jquery
    jquery: ['jquery'],
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'dll'),
    library: '[name]_[hash]', // export name
  },
  plugins: [
    // create a manifest.json map ,which maps to jquery
    new Webpack.DllPlugin({
      name: '[name]_[hash]',
      path: resolve(__dirname, 'dll/manifest.json'),
    }),
  ],
};
