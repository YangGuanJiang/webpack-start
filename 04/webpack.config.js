/*
 HMR: Hot Module Replacement
*/

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { resolve } = require('path');

module.exports = {
    //config
    entry: [
        './src/js/index.js',
        './src/index.html',
    ],
    output: {
        filename: 'js/bundle.js',
        path: resolve(__dirname, 'build')
    },
    module: {
        //loader
        rules: [
            {
                test: /\.css$/,
                use: [// use array uses loader from the last index to 0
                    'style-loader', //create a style tag, add js css resources in head
                    'css-loader'    // css file -> commonJs module, there is css style string
                ]
            },{
                test: /\.less$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            },{ //cant resole picture in img tag
               test: /\.(jpg|png|gif)$/ ,
               loader: 'url-loader',
               options: {//file-loader
                   limit: 8 * 1024,
                   esModule: false,
                   outputPath: 'pictures'
               }
            },{
                test: /\.html$/,//import sources in html
                loader: 'html-loader',
            },
            {
                exclude: /\.(css|less|jpg|png|gif|html|json|js)$/,
                loader: 'url-loader',
                options: {
                    name: '[hash:10].[ext]',
                    outputPath: 'others'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        })
    ],
    //plugin
    mode: 'development',
    // mode: 'production',

    //devServer -> automate
    //no output, only build in memory
    //init devServer: npx webpack-dev-server
    devServer: {
        contentBase: resolve(__dirname, 'build'),
        compress: true,
        port: '9999',
        open: true,
        hot: true,// restart to enable config
    },
    devtool: 'source-map'
}

/*
    source map: map source code to built code
    [inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map

    inline-source-map:    map in output.js, no individual file; faster  error at source.js
    hidden-source-map:    individual file                               error at built.js   //hide source code
    eval-source-map:      separated in 'eval' in output.js              error at source.js
    nosources-source-map: individual file                               only error msg, no location for error
    cheap-source-map:     individual file                               error at source.js, only row no column
    module-source-map:     individual file                              error at source.js

    speed eval > inline > cheap

    develop: eval-source-map // speed, debug friendly
    product:  // low package size, hide source code
 */