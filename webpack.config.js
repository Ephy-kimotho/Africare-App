const path = require("path")

module.exports = {
    entry: "../africare/src/Sign_UpLogin/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    devtool: "eval-source-map"
}