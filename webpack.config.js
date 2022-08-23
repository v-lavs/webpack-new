const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HotModuleReplacementPlugin = require('webpack').HotModuleReplacementPlugin;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

// Look for .html files
const htmlFiles = [];
const directories = ['src'];

while (directories.length > 0) {
    const directory = directories.pop();
    const dirContents = fs.readdirSync(directory)
        .map(file => path.join(directory, file));

    htmlFiles.push(...dirContents.filter(file => file.endsWith('.html')));
    directories.push(...dirContents.filter(file => fs.statSync(file).isDirectory()));
}

module.exports = {
    mode: 'development',
    entry: './src/js/index.js',
    output: {
        publicPath: "./",
        path: __dirname + '/dist',
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.html$/i,
                use: 'html-loader'
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader']
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    MiniCssExtractPlugin.loader,
                    // Translates CSS into CommonJS
                    "css-loader",
                    "postcss-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
            {
                test: /\.(png|jp(e*)g|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8000,
                            name: 'assets/images/[name].[ext]',
                            publicPath: 'assets/images/',
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        // Build a new plugin instance for each .html file found
        ...htmlFiles.map(htmlFile =>
            new HtmlWebpackPlugin({
                template: htmlFile,
                filename: htmlFile.replace(path.normalize("src/"), ""),
                inject: 'body'
            })
        ),
        new MiniCssExtractPlugin(),
        new HotModuleReplacementPlugin(),

    ],
    watchOptions: {
        ignored: /node_modules/,
    },
    devServer: {
        compress: false,
        port: 3000,
    },
};