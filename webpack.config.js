const path = require("path");

module.exports = {
  entry: "./src/index.js",  // Main entry file
  output: {
    path: path.resolve(__dirname, "dist"), // Output directory
    filename: "nn-visualizer.js",  // Output file
    library: "NeuralNetworkVisualizer", // Library name for UMD
    libraryTarget: "umd",  // Supports CommonJS, AMD, and global variable
    globalObject: "this" // Ensures compatibility with Node.js and browser
  },
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
