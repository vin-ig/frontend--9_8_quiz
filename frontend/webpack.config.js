const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/app.ts',
    mode: 'development',
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    devtool: 'inline-source-map',
    devServer: {
        static: '.dist',
        compress: true,
        port: 9000,
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html"
        }),
        new CopyPlugin({
            patterns: [
                {from: "templates", to: "templates"},
                {from: "styles", to: "styles"},
                {from: "static/fonts", to: "fonts"},
                {from: "static/images", to: "images"},
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    }
};