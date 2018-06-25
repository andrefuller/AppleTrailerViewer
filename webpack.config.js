// Libs
const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const GoogleFontsPlugin = require('google-fonts-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');

// Config
const parts = require('./config/webpack.parts.config');
const bootstrapEntryPoints = require('./config/webpack.bootstrap.config');
const PORT = 3000;
const PATHS = {
  app: path.join(__dirname, 'src/js/app.js'),
  dist: path.join(__dirname, 'dist'),
  publicPath: `http://localhost:${PORT}/`,
  appTemplate: './config/templates/index.html',
};

const commonConfig = merge([{
    entry: [
      PATHS.app,
      'tether',
      'font-awesome-loader',
      bootstrapEntryPoints.dev,
    ],
    output: {
      path: PATHS.dist,
      filename: 'app.js',
    },
    resolve: {
      extensions: ['* ', '.js'],
      modules: ['node_modules']
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'AppleTrailerViewer',
        template: PATHS.appTemplate
      }),
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
        underscore: "underscore",
        Tether: "tether",
        "window.Tether": "tether",
        Alert: "exports-loader?Alert!bootstrap/js/dist/alert",
        Button: "exports-loader?Button!bootstrap/js/dist/button",
        Carousel: "exports-loader?Carousel!bootstrap/js/dist/carousel",
        Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
        Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
        Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
        Popover: "exports-loader?Popover!bootstrap/js/dist/popover",
        Scrollspy: "exports-loader?Scrollspy!bootstrap/js/dist/scrollspy",
        Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
        Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
        Util: "exports-loader?Util!bootstrap/js/dist/util",
        Popper: ['popper.js', 'default'],
        Bloodhound: "exports-loader!typeahead.js/dist/bloodhound.min"
      }),
      new GoogleFontsPlugin({
        fonts: [{
          family: "Roboto Condensed"
        }]
      }),
      // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
    module: {
      rules: [{
          test: /\.hbs$/,
          loader: 'handlebars-loader'
        },
        {
          test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: "url-loader"
        },
        {
          test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
          use: 'file-loader'
        },
        {
          test: /bootstrap\/dist\/js\/umd\//,
          use: 'imports-loader?jQuery=jquery'
        },
      ],
    },
  },
  parts.lintCSS({ include: PATHS.app }),
  parts.lintJavaScript({
    include: PATHS.app,
    exclude: /node_modules/
  }),
  parts.loadCSS(),
  parts.transpileJavaScript({
    exclude: /node_modules/
  }),
]);

const productionConfig = merge([{
    plugins: [
      new CleanWebpackPlugin([PATHS.dist], {
        verbose: true,
        dry: false
      }),
    ]
  },
  parts.extractCSS({
    use: ['css-loader', parts.autoprefix()],
  }),
  parts.purifyCSS({
    paths: glob.sync(`${PATHS.app}/**/*.js`, { nodir: true }),
  }),
  parts.generateSourceMaps({
    type: 'source-map'
  }),
  parts.loadImages({
    options: {
      limit: 15000,
      name: '[name].[ext]'
    }
  }),
]);

const developmentConfig = merge([{
    output: {
      pathinfo: true,
      devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]',
    },
    // Turn off performance hints during development because we don't do any
    // splitting or minification in interest of speed. These warnings become
    // cumbersome.
    performance: {
      hints: false,
    },
  },
  parts.generateSourceMaps({
    type: 'eval-source-map'
  }),
  parts.devServer({
    port: PORT,
  }),
  parts.loadImages({
    options: {
      name: '[name].[ext]'
    }
  }),
]);

module.exports = (env) => {
  let config;
  if (env === 'production') {
    config = merge(commonConfig, productionConfig);
  } else {
    config = merge(commonConfig, developmentConfig);
  }

  return config;
};
