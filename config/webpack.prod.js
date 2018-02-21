var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');
const DtsBundleWebpack = require('dts-bundle-webpack')
const nodeExternals = require('webpack-node-externals');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = webpackMerge(commonConfig, {
    devtool: 'source-map',

    externals: [nodeExternals()],
    output: {
        path: helpers.root('dist'),
        publicPath: '/',
        filename: '[name].js',
        library: 'lib',
        libraryTarget: "umd"
    },

    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(ENV)
            }
        }),
        new DtsBundleWebpack({
            name: 'angulator',
            main: 'dist/src/app/module.d.ts',
            baseDir: 'dist',
            out: 'index.d.ts',
            externals: false,
            exclude: function (file, external) {
                console.log(file);
                if (file.indexOf("index.d.ts") > -1) { 
                    return true;
                }
                return false;
            },
            referenceExternals: false,
            verbose: false,
            emitOnIncludedFileNotFound: true
        })
    ]
});

