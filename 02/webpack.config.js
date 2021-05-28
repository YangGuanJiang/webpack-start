// run by node , use commonJs

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { resolve } = require('path');

module.exports = {
    //config
    entry: './src/index.js',
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
        open: true
    }
}