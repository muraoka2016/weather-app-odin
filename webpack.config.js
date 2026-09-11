const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");

module.exports = (env, argv) => {
  // Identifica se está rodando em produção (Vercel) ou desenvolvimento (sua máquina)
  const isProduction = argv.mode === "production";

  return {
    entry: "./src/index.js",

    output: {
      path: path.resolve(__dirname, "dist"),
      // Usa hashes apenas em produção para evitar problemas de cache no navegador
      filename: isProduction ? "bundle.[contenthash].js" : "bundle.js",
      publicPath: "/", // Garante caminhos corretos para assets na Vercel
      clean: true,
    },

    devServer: {
      static: path.resolve(__dirname, "dist"),
      port: 3000,
      open: true,
      hot: true,
    },

    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              sourceType: "unambiguous",
            },
          },
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/template.html",
        filename: "index.html",
      }),
      new Dotenv({
        path: "./.env",
        systemvars: true,
      }),
    ],

    mode: argv.mode || "development",
  };
};
