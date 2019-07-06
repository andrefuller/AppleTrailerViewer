const path = require("path");
const glob = require("glob");
const webpack = require("webpack");
const merge = require("webpack-merge");

const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const GoogleFontsPlugin = require("google-fonts-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

// Config
const parts = require("./config/webpack.parts.config");
const bootstrapEntryPoints = require("./config/webpack.bootstrap.config");

const PORT = 8080;
const PATHS = {
  app: path.join(__dirname, "src/js/app.js"),
  dist: path.join(__dirname, "dist"),
  publicPath: `http://localhost:${PORT}/`,
  appTemplate: "./config/templates/index.html"
};
const commonConfig = merge([
  {
    entry: [bootstrapEntryPoints.dev, PATHS.app, "font-awesome-loader"],
    output: {
      path: PATHS.dist,
      filename: "app.js"
    },
    resolve: {
      extensions: ["* ", ".js"],
      modules: ["node_modules"]
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.hbs$/,
          loader: "handlebars-loader"
        },
        {
          test: /\.woff2?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          use: "url-loader"
        },
        {
          test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
          use: "file-loader"
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader"]
        },
        {
          test: /bootstrap\/dist\/js\/umd\//,
          use: "imports-loader?jQuery=jquery"
        }
      ]
    },
    plugins: [
      new HtmlWebPackPlugin({
        filename: "./index.html",
        title: "AppleTrailerViewer",
        template: PATHS.appTemplate
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      }),
      new GoogleFontsPlugin({
        fonts: [
          {
            family: "Roboto Condensed"
          }
        ]
      }),
      // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
  },
  parts.lintCSS({ include: PATHS.app }),
  parts.lintJavaScript({
    include: PATHS.app,
    exclude: /node_modules/
  }),
  parts.loadCSS(),
  parts.transpileJavaScript({
    exclude: /node_modules/
  })
]);

const productionConfig = merge([
  {
    plugins: [
      new CleanWebpackPlugin({
        verbose: true,
        dry: false
      })
    ]
  },
  parts.extractCSS({
    use: ["css-loader", parts.autoprefix()]
  }),
  parts.purifyCSS({
    paths: glob.sync(`${PATHS.app}/**/*.js`, { nodir: true })
  }),
  parts.generateSourceMaps({
    type: "source-map"
  }),
  parts.loadImages({
    options: {
      limit: 15000,
      name: "[name].[ext]"
    }
  })
]);

const developmentConfig = merge([
  {
    output: {
      pathinfo: true,
      devtoolModuleFilenameTemplate: "webpack:///[absolute-resource-path]"
    },
    // Turn off performance hints during development because we don't do any
    // splitting or minification in interest of speed. These warnings become
    // cumbersome.
    performance: {
      hints: false
    }
  },
  parts.generateSourceMaps({
    type: "eval-source-map"
  }),
  parts.devServer({
    port: PORT
  }),
  parts.loadImages({
    options: {
      name: "[name].[ext]"
    }
  })
]);

module.exports = env => {
  let config;
  if (env === "production") {
    config = merge(commonConfig, productionConfig);
  } else {
    config = merge(commonConfig, developmentConfig);
  }

  return config;
};
