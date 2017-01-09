const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const fs = require('fs');
const path = require('path');
const autoprefixer = require('autoprefixer');

const assetsPath = path.join(__dirname, '/public');

const config = {
    entry: './src/js/index.js',
    output: {
        path: assetsPath,
        publicPath: '/',
        filename: '[name].js'
    },

    resolve: {
        modulesDirectories: ['node_modules'],
        extensions: ['', '.js', '.jsx', '.less']
    },

    resolveLoader: {
      modulesDirectories: ['node_modules'],
      moduleTemplates: ['*-loader', '*'],
      extensions: ['', '.js']
    },

    module: {
        preLoaders: [],
        loaders: [{
            test:   /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                presets: ['es2015', 'react'],
                plugins: ['transform-runtime', 'transform-object-rest-spread']
            }
        }, {
            test: /\.(jpg|jpeg|png|svg|ttf|eot|woff|woff2)$/,
            loader: 'file?name=[path][name].[ext]?[hash]'
        }, {
            test: /\.json$/, loader: 'json-loader'
        }]
    },

    postcss: () => [autoprefixer({
        browsers: ['last 2 versions']
    })],

    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            _: 'lodash',
            React: 'react',
            ReactDOM: 'react-dom'
        })
    ],

    devServer: {
        host: 'localhost', // default
        port: 8080, // default
        contentBase: assetsPath,
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    }
};

// ESlint
if (fs.existsSync('.eslintrc')) {
    config.module.eslint = {
        configFile: '.eslintrc'
    };

    config.module.preLoaders.push({
        test: /\.(js|jsx)$/,
        loaders: ['eslint'],
        include: [path.resolve(__dirname, 'src/js')],
    });
}

// Style loaders
if (process.env.production) {
    config.output.publicPath = './';

    config.module.loaders.push({
            test: /\.less$/,
            loader: ExtractTextPlugin.extract('css!postcss!less?resolve url')
        }/*, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('css?resolve url')
        },*/);
} else {
    fs.readdirSync(assetsPath)
        .map(fileName => path.extname(fileName) === '.css' ? fs.unlinkSync(`${assetsPath}/${fileName}`) : '');

    config.module.loaders.push({
        test: /\.less$/,
        loader: 'style!css!postcss!less?resolve url'
    });
}

// Plugins
if (process.env.production) {
    config.plugins.push(
        new ExtractTextPlugin('[name].css', {
            allChunks: true
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true,
                unsafe: true
            }
        })
    );
}

module.exports = config;
