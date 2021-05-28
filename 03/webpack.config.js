const { resolve } = require('path');
const Webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');

// 定义nodejs环境变量：决定使用browserslist的哪个环境
process.env.NODE_ENV = 'production';

// 复用loader
const commonCssLoader = [
  MiniCssExtractPlugin.loader,
  'css-loader',
  {
    // 还需要在package.json中定义browserslist
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      // eslint-disable-next-line global-require
      plugins: () => [require('postcss-preset-env')()],
    },
  },
];

module.exports = {
  // entry: './src/js/index.js', // single entry
  entry: {
    index: './src/js/index.js',
    util: './src/js/tree-shaking.js',
  }, // multiple entries
  output: {
    /* add hash to force update even there is cache
    [hash:10] may cause cache invalid
    [chunkhash:10]
    [contenthash:10] */
    filename: 'js/[name].[contenthash:10]..js', // [name]will get the name in entry object
    path: resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      {
        // 在package.json中eslintConfig --> airbnb
        test: /\.js$/,
        exclude: /node_modules/,
        // 优先执行
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          fix: true,
        },
      },
      {
        // 以下loader只会匹配一个
        // 注意：不能有两个配置处理同一种类型文件
        oneOf: [
          {
            test: /\.css$/,
            use: [...commonCssLoader],
          },
          {
            test: /\.less$/,
            use: [...commonCssLoader, 'less-loader'],
          },
          /*
            正常来讲，一个文件只能被一个loader处理。
            当一个文件要被多个loader处理，那么一定要指定loader执行的先后顺序：
              先执行eslint 在执行babel
          */
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
              /* multi-thread build
                cost 600ms to start a process;
                and cost memory and time to communication between processes
              */
              {
                loader: 'thread-loader',
                options: {
                  workers: 2,
                },
              },
              {
                loader: 'babel-loader',
                options: {
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        useBuiltIns: 'usage',
                        corejs: {
                          version: 3,
                        },
                        targets: {
                          chrome: '60',
                          firefox: '50',
                        },
                      },
                    ],
                  ],
                  cacheDirectory: true, // babel cache
                },
              },
            ],
          },
          {
            test: /\.(jpg|png|gif)/,
            loader: 'url-loader',
            options: {
              limit: 8 * 1024,
              name: '[chunkhash:10].[ext]',
              outputPath: 'imgs',
              esModule: false,
            },
          },
          {
            test: /\.html$/,
            loader: 'html-loader',
          },
          {
            exclude: /\.(js|css|less|html|jpg|png|gif)/,
            loader: 'file-loader',
            options: {
              outputPath: 'media',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new Webpack.DllReferencePlugin({
      manifest: resolve(__dirname, 'dll/manifest.json'),
    }),
    new AddAssetHtmlWebpackPlugin({
      filepath: resolve(__dirname, 'dll/jquery.js'),
    }),
    new MiniCssExtractPlugin({
      filename: 'css/built.[hash:10].css',
    }),
    new OptimizeCssAssetsWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
    // part of the functionality is enable when offline
    new WorkboxWebpackPlugin.GenerateSW({
      /* quick boost serviceworker(SW)
         remove previous SW
         create a SW config
      */
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
  /*
    build node_modules as a separated file
    auto analyse the public file in multi-entry chunk, if there is build it to a separated file
  */
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  /* tree shaking in production
    config "sideEffects": false in package.json may discard [css/ @babel/ polyfill]
  */
  mode: 'production',
  devtool: 'eval-source-map',
  externals: { // ignore lib use CDN
    // lib name want to be ignored
    jquery: 'jQuery',
  },
};
