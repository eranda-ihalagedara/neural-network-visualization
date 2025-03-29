const path = require("path");

module.exports = {
  entry: "./src/index.js",  // Main entry file
  output: {
    path: path.resolve(__dirname, "dist"), // Output directory
    filename: "nn-visualizer.js",  // Output file
    libraryTarget: "module",
  },
  experiments: {
    outputModule: true
  },
  devtool: "eval-source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"] // Transpile ES6+ to ES5
          }
        }
      }
    ]
  },
  externals: {
    three: "three", // Prevents bundling Three.js (users install it separately)
    "@tensorflow/tfjs": "@tensorflow/tfjs"
  },
  mode: "production"
};