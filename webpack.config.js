const path = require("path");
const fs = require("fs");
const NodemonPlugin = require("nodemon-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

const routesPath = path.resolve(__dirname, "src", "routes");
const files = fs.readdirSync(routesPath).filter((file) => {
  const fileName = file.split(".")[0];
  const skip = ["index"].includes(fileName);
  return !skip;
});

let routes = files.reduce((acc, file) => {
  const fileName = file.split(".")[0];
  acc[fileName] = path.resolve(routesPath, file);
  return acc;
}, {});

routes = Object.keys(routes).map((r) => ({ [`routes/${r}`]: routes[r] }));
routes = Object.assign(...routes);

module.exports = (env, argv) => {
  const isDev = env.development;

  const config = {
    entry: {
      app: "./src/index.js",
      ...routes,
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      devtoolModuleFilenameTemplate: "[absolute-resource-path]",
      clean: true,
    },

    devServer: {
      port: 3000,
      hot: isDev,
      open: true,
    },
    resolve: {
      extensions: [".js", ".json"],
    },
    externalsPresets: {
      node: true,
    },
    externals: [nodeExternals()],
    node: {
      global: false,
      __dirname: false,
      __filename: false,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: "babel-loader",
            },
          ],
        },
      ],
    },
    resolve: {
      modules: [path.resolve(__dirname, "src"), "node_modules"],
    },
    plugins: [
      new NodemonPlugin({
        watch: path.resolve(__dirname, "dist"),
        ignore: ["*.js.map"],
        ext: "js,json",
        env: {
          NODE_ENV: "development",
        },
      }),

      new webpack.SourceMapDevToolPlugin({
        filename: "[name].js.map",
      }),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "src", "prisma", "schema.prisma"),
            to: path.resolve(__dirname, "dist", "prisma", "schema.prisma"),
          },
        ],
      }),
    ],
  };

  return config;
};
