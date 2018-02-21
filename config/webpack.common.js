var webpack = require('webpack');
var helpers = require('./helpers');
const CopyWebpackPlugin = require('copy-webpack-plugin')



module.exports = {
  entry: {
    'index': './src/app/index.ts'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [
          /node_modules/,
          /demo/,
        ],
        loaders: [
          {
            loader: 'awesome-typescript-loader',
            options: { configFileName: helpers.root('tsconfig.webpack.json') }
          }
        ]
      }
    ]
  },

  plugins: [
    // Workaround for angular/angular#11580
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)@angular/,
      helpers.root('./src'), // location of your src
      {} // a map of your routes
    ),
    new CopyWebpackPlugin([{
      from: helpers.root('package.json'), to: helpers.root('dist/package.json')
    }])
  ]
};

