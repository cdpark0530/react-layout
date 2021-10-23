import {resolve} from "path";

import type Webpack from "webpack";
import type WebpackDevServer from "webpack-dev-server";
import HtmlBundler from "html-webpack-plugin";
import CssExtractor from "mini-css-extract-plugin";
import CssMinimizer from "css-minimizer-webpack-plugin";
import TsPathParser from "tsconfig-paths-webpack-plugin";


const env = process.env.NODE_ENV ?? "production";
if (env !== "development" && env !== "production") {
	throw new TypeError(`NODE_ENV is ${env}. It can be either development or production.`);
}
const isDev = env === "development";

const context = resolve(__dirname, "test");
const outputPath = resolve(context, "dist");

const config: Configuration = {
	mode: env,
	context,
	entry: "index.tsx",
	output: {
		filename: "index.js",
		path: outputPath,
	},
	resolve: {
		extensions: [".js", ".ts", ".tsx"],
		preferRelative: true,
		plugins: [
			new TsPathParser(),
		],
	},
	plugins: [
		new HtmlBundler({
			template: "index.html"
		}),
		new CssExtractor({
			filename: "index.css"
		}),
	],
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: [
					"ts-loader"
				],
			},
			{
				test: /\.s[ac]ss$/,
				exclude: /node_modules/,
				use: [
					CssExtractor.loader,
					{
						loader: "css-loader",
						options: {
							sourceMap: isDev,
						},
					},
					{
						loader: "sass-loader",
						options: {
							sassOptions: {
								includePaths: [
									"src",
								]
							},
							/**
							 * for resolve-url-loader to be able to parse relative url
							 */
							sourceMap: true,
						}
					}
				],
			},
		],
	},
	optimization: {
		minimize: true,
		minimizer: [
			new CssMinimizer(),
		],
	},
	devtool: isDev && "source-map",
	devServer: {
		port: 80,
		hot: true,
		static: {
			directory: outputPath,
		},
		devMiddleware: {
			stats: {
				builtAt: true,
				assets: false,
				modules: false,
			}
		},
	},
};

interface Configuration extends Webpack.Configuration {
	devServer: WebpackDevServer.Configuration;
}

export default config;
