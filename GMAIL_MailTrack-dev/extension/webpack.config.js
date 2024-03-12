const {
  sentryWebpackPlugin
} = require("@sentry/webpack-plugin");

const path = require("path");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  devtool: "source-map",
  entry: {
    ExtensionContent: "./src/entry/ExtensionContent.ts",
    ExtensionBackground: "./src/entry/ExtensionBackground.ts",
    ExtensionInjectedScript: "./src/entry/ExtensionInjectedScript.ts",

    // Pages
    ExtensionPopup: "./src/entry/ExtensionPopup.ts",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [new CleanWebpackPlugin(), new CopyPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, "../", "app", "dist"),
        to: path.resolve(__dirname, "dist", "pages", "popup"),
        noErrorOnMissing: true,
      },
      {
        from: path.resolve(__dirname, "src", "manifest.json"),
        to: path.resolve(__dirname, "dist"),
      },
      {
        from: path.resolve(__dirname, "src", "css"),
        to: path.resolve(__dirname, "dist", "css"),
      },
      {
        from: path.resolve(__dirname, "src", "assets"),
        to: path.resolve(__dirname, "dist", "assets"),
      },
    ],
  }), sentryWebpackPlugin({
    // authToken: process.env.SENTRY_AUTH_TOKEN,
    // authToken: "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",
    // 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
    authToken: "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",
    org: "cleankoding",
    project: "javascript",
    dsn: "https://9007ae4227ee16e45b97da4d022e482a@o4506856607580160.ingest.us.sentry.io/4506856621670400", // Replace with your Sentry project DSN
    release: "1.0.0", // Use environment variable for release version
    environment: process.env.NODE_ENV || 'development', // Set environment based on NODE_ENV
    inject: true, // Enable automatic injection into all bundles
    options: {
      telemetry: false,
    }
  })],
};