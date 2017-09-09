const PurifyCSSPlugin = require('purifycss-webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

exports.devServer = ({host, port} = {}) => ({
  devServer: {
    stats: {
      colors: true,
      modules: false,
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
    host, // Defaults to `localhost`
    port, // Defaults to 8080
    historyApiFallback: true,
    quiet: false,
    noInfo: false,
    lazy: false,
    proxy: {
      '/home/feeds/**': {
        target: 'http://trailers.apple.com/trailers',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: ''
      },
      '/trailers/**': {
        target: 'http://trailers.apple.com/',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: ''
      },
      '/feeds/data/**': {
        target: 'http://trailers.apple.com/trailers',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: ''
      },
      'home/scripts/**': {
        target: 'http://trailers.apple.com/trailers',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: ''
      }
    },
    overlay: {
      errors: true,
      warnings: true,
    },
  },
});

exports.lintJavaScript = ({include, exclude, options}) => ({
  module: {
    rules: [{
      test: /\.js$/,
      include,
      exclude,
      enforce: 'pre',
      loader: 'eslint-loader',
      options,
    }, ],
  },
});

exports.transpileJavaScript = ({include, exclude, options}) => ({
  module: {
    rules: [{
      test: /\.js$/,
      include,
      exclude,
      loaders: ['babel-loader'],
      options,
    }, ],
  },
});

exports.generateSourceMaps = ({ type }) => ({
  devtool: type,
});

exports.loadCSS = ({include, exclude} = {}) => ({
  module: {
    rules: [
      {
        test   : /\.css$/,
        loaders: ['style-loader', 'css-loader', 'resolve-url-loader']
      },
      {
        test   : /\.scss$/,
        include: /src/,
        use: [
          {
            loader: 'style-loader' // inject CSS to page
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS modules
          },
          {
            loader: 'postcss-loader', // Run post css actions
            options: {
              plugins: function() { // post css plugins, can be exported to postcss.config.js
                return [
                  require('precss'),
                  require('autoprefixer')
                ];
              }
            }
          },
          {
            loader: 'sass-loader', // compiles SASS to CSS
          },
          {
            loader: 'resolve-url-loader'
          },
        ]
      },
    ],
  },
});

exports.lintCSS = ({ include, exclude }) => ({
  module: {
    rules: [
      {
        test: /\.css$/,
        include,
        exclude,
        enforce: 'pre',

        loader: 'postcss-loader',
        options: {
          plugins: () => ([
            require('stylelint')(),
          ]),
        },
      },
    ],
  },
});

exports.purifyCSS = ({ paths }) => ({
  plugins: [
    new PurifyCSSPlugin({ paths }),
  ],
});

exports.extractCSS = ({ include, exclude, use }) => {
  // Output extracted CSS to a file
  const plugin = new ExtractTextPlugin({
    filename: '[name].css',
  });

  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          include,
          exclude,

          use: plugin.extract({
            use,
            fallback: 'style-loader',
          }),
        },
      ],
    },
    plugins: [ plugin ],
  };
};

exports.autoprefix = () => ({
  loader: 'postcss-loader',
  options: {
    plugins: () => ([
      require('autoprefixer')(),
    ]),
  },
});

exports.loadImages = ({ include, exclude, options } = {}) => ({
  module: {
    rules: [
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        include,
        exclude,
        use: {
          loader: 'url-loader',
          options,
        },
      }
    ],
  },
});
