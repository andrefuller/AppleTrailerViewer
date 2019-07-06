const PurifyCSSPlugin = require("purifycss-webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const StylishFormatter = require("eslint/lib/formatters/stylish");
const StyleLintPlugin = require("stylelint-webpack-plugin");

exports.devServer = ({ host, port } = {}) => ({
  devServer: {
    stats: {
      colors: true,
      modules: false
    },
    host, // Defaults to `localhost`
    port, // Defaults to 8080
    historyApiFallback: true,
    quiet: false,
    noInfo: false,
    lazy: false,
    overlay: {
      errors: true,
      warnings: true
    }
  }
});

exports.lintJavaScript = ({ options }) => ({
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "eslint-loader",
            options: {
              formatter: StylishFormatter
            }
          }
        ],
        options
      }
    ]
  }
});

exports.transpileJavaScript = ({ include, exclude, options }) => ({
  module: {
    rules: [
      {
        test: /\.js$/,
        include,
        exclude,
        loaders: ["babel-loader"],
        options
      }
    ]
  }
});

exports.generateSourceMaps = ({ type }) => ({
  devtool: type
});

exports.loadCSS = () => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        loaders: ["style-loader", "css-loader", "resolve-url-loader"]
      },
      {
        test: /\.scss$/,
        include: /src/,
        use: [
          {
            loader: "style-loader" // inject CSS to page
          },
          {
            loader: "css-loader" // translates CSS into CommonJS modules
          },
          {
            loader: "postcss-loader" // Run post css actions
          },
          {
            loader: "sass-loader" // compiles SASS to CSS
          },
          {
            loader: "resolve-url-loader"
          }
        ]
      }
    ]
  }
});

exports.lintCSS = ({ include, exclude }) => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        include,
        exclude,
        enforce: "pre",

        loader: "postcss-loader",
        options: {
          plugins: () => [new StyleLintPlugin()]
        }
      }
    ]
  }
});

exports.purifyCSS = ({ paths }) => ({
  plugins: [new PurifyCSSPlugin({ paths })]
});

exports.extractCSS = () => {
  // Output extracted CSS to a file
  const plugin = new MiniCssExtractPlugin({
    filename: "[name].css"
  });

  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                // you can specify a publicPath here
                // by default it uses publicPath in webpackOptions.output
                publicPath: "../",
                hmr: process.env.NODE_ENV === "development"
              }
            },
            "css-loader"
          ]
        }
      ]
    },
    plugins: [plugin]
  };
};

exports.autoprefix = () => ({
  loader: "postcss-loader"
});

exports.loadImages = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        include,
        exclude,
        use: {
          loader: "url-loader",
          options
        }
      }
    ]
  }
});
