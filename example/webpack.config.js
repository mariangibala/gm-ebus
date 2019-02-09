const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const path = require('path')

const NODE_ENV = process.env.NODE_ENV || 'dev'
const DEBUG = NODE_ENV === 'dev'

const config = {
  production: {
    watch: false,
    mode: 'production'
  },
  dev: {
    watch: true,
    mode: 'development'
  }
}

const include = [
  path.resolve(__dirname, 'src/js')
]

const plugins = [
  // the 'transform-runtime' plugin tells babel to require the runtime
  // instead of inlining it.
  'transform-runtime',
  'transform-decorators-legacy',
  'syntax-dynamic-import',
  'transform-class-properties',
  'transform-object-rest-spread'
]



const webpackConfig = {
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'App.js',
    publicPath: '/'
  },
  entry: path.join(__dirname, 'src/js/entry.js'),
  devtool: '',
  watchOptions: {
    poll: 5000
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist')
  },
  // activate for detailed build log
 /* stats: {
    colors: true,
    modules: true,
    reasons: true,
    errorDetails: true
  },*/
  module: {
    rules: [
      {
        test: /\.js?$/,
        include,
        loader: 'babel-loader',
        options: {
          presets: ['env'],
          plugins
        }
      },
      {
        test: /\.jsx?$/,
        include,
        loader: 'babel-loader',
        options: {
          presets: ['react', 'env'],
          plugins
        }
      }
    ]
  },
  resolve: {
    modules: [path.join(__dirname, 'src/js'), 'node_modules'],
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: 'react',
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html')
    }),
    new webpack.DefinePlugin({
      DEBUG: JSON.stringify(DEBUG),

    }),
  ],

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        test: /\.js(\?.*)?$/i,
        uglifyOptions: {
          compress: {
            warnings: false
          }
        }
      }),
    ],
  },

  ...config[NODE_ENV],
}

if (NODE_ENV === 'production') {
  webpackConfig.plugins.push(new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify('production')
    }
  }))
}

module.exports = webpackConfig
