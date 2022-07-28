// rollup.config.js
import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";

export default {
  input: "client/index.js",
  output: {
    file: "dist/client.js",
    format: "iife"
  },
  plugins: [
    resolve(),
    babel({"presets": ["@babel/preset-env"], "babelHelpers": 'bundled'}),
    commonjs({
      include: "node_modules/**"
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production")
    })
  ]
};
